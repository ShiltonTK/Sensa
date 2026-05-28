import os
import sys
import time
import threading
from collections import deque
from datetime import datetime
from pathlib import Path
import pandas as pd

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio

# ==========================================
# 1. PLUX CONFIGURATION (Mac Adapted)
# ==========================================
# UPDATE THIS PATH to wherever you saved the Mac PLUX API folder
PLUX_API_PATH = Path("/Users/macbook/Documents/sensa_git/sensa-ui/backend/M1_312") 

# On Mac, the PLUX API usually expects the raw MAC address without "BTH"
DEVICE_ADDRESS = "00:07:80:8C:06:DE" 

SAMPLING_RATE = 1000
RESOLUTION = 16
PORTS = [1]  # EDA on port 1
LIVE_BUFFER_SECONDS = 10
LIVE_BUFFER_SIZE = SAMPLING_RATE * LIVE_BUFFER_SECONDS

# Load PLUX API
if not PLUX_API_PATH.exists():
    print(f"WARNING: PLUX API folder not found at {PLUX_API_PATH}")
else:
    # Mac simply needs the folder added to sys.path (no DLL directories)
    if str(PLUX_API_PATH) not in sys.path:
        sys.path.insert(0, str(PLUX_API_PATH))

try:
    import plux
    print(f"PLUX imported successfully. Version: {plux.version}")
except ImportError as e:
    print(f"Failed to import PLUX: {e}")

# ==========================================
# 2. GLOBAL STATE & BUFFERS
# ==========================================
live_seq = deque(maxlen=LIVE_BUFFER_SIZE)
live_time = deque(maxlen=LIVE_BUFFER_SIZE)
live_eda = deque(maxlen=LIVE_BUFFER_SIZE)

live_dev = None
stream_thread = None
is_recording = False
recorded_rows = []
record_lock = threading.Lock()

# ==========================================
# 3. PLUX HARDWARE LOGIC
# ==========================================
class LiveEDAAcquisition(plux.SignalsDev):
    def onRawFrame(self, nSeq, data):
        global is_recording, recorded_rows
        timestamp = time.time()
        eda_raw = data[0]

        # Update live buffers
        live_seq.append(nSeq)
        live_time.append(timestamp)
        live_eda.append(eda_raw)

        # Record if active
        if is_recording:
            row = {"seq": nSeq, "timestamp": timestamp, "EDA_raw": eda_raw}
            with record_lock:
                recorded_rows.append(row)

        return not self.running

def acquisition_worker():
    global live_dev
    try:
        live_dev = LiveEDAAcquisition(DEVICE_ADDRESS)
        live_dev.running = True
        print("Starting live EDA stream...")
        live_dev.start(SAMPLING_RATE, PORTS, RESOLUTION)
        live_dev.loop()
    except Exception as e:
        print("Acquisition error:", e)
    finally:
        if live_dev:
            try: live_dev.stop()
            except: pass
            try: live_dev.close()
            except: pass
        live_dev = None
        print("Live device closed.")

# ==========================================
# 4. FASTAPI WEB SERVER SETUP
# ==========================================
app = FastAPI(title="SENSA Hardware API")

# Allow React to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 5. REST ENDPOINTS (Commands)
# ==========================================
@app.get("/api/status")
def get_status():
    return {
        "device_connected": live_dev is not None,
        "is_recording": is_recording,
        "buffer_size": len(live_eda)
    }

@app.post("/api/stream/start")
def api_start_stream():
    global stream_thread, live_dev
    if live_dev is not None:
        return {"status": "Stream already running"}
    
    stream_thread = threading.Thread(target=acquisition_worker, daemon=True)
    stream_thread.start()
    return {"status": "Stream started"}

@app.post("/api/stream/stop")
def api_stop_stream():
    global live_dev
    if live_dev is not None:
        live_dev.running = False
        return {"status": "Stop requested"}
    return {"status": "No stream active"}

@app.post("/api/record/start")
def api_start_record():
    global is_recording, recorded_rows
    with record_lock:
        recorded_rows = []
    is_recording = True
    return {"status": "Recording started"}

@app.post("/api/record/stop")
def api_stop_record():
    global is_recording
    is_recording = False
    return {"status": "Recording stopped", "samples": len(recorded_rows)}

@app.post("/api/record/save")
def api_save_record():
    global is_recording
    is_recording = False
    time.sleep(0.2)
    
    with record_lock:
        rows_snapshot = list(recorded_rows)
    
    if len(rows_snapshot) == 0:
        return {"status": "error", "message": "No samples to save"}

    output_dir = "data"
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = Path(output_dir) / f"eda_recording_{timestamp}.csv"
    
    df = pd.DataFrame(rows_snapshot)
    df.to_csv(filename, index=False)
    
    return {"status": "success", "file": str(filename), "samples": len(df)}

# ==========================================
# 6. WEBSOCKET ENDPOINT (Live Data Stream)
# ==========================================
@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Send the most recent EDA value to React at ~60Hz
            if len(live_eda) > 0:
                payload = {
                    "eda_raw": live_eda[-1],
                    "timestamp": live_time[-1]
                }
                await websocket.send_json(payload)
            # Sleep for ~16ms (roughly 60 frames per second)
            await asyncio.sleep(0.016)
    except WebSocketDisconnect:
        print("Client disconnected from live stream")