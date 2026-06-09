import asyncio
import logging
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/calibration")

# --- Try to load Tobii Pro SDK ---
try:
    import tobii_research as tr # type: ignore
    TOBII_PRO_AVAILABLE = True
except ImportError:
    TOBII_PRO_AVAILABLE = False

# Global state for calibration
calibration_instance: Optional[object] = None
current_tracker: Optional[object] = None


class PointRequest(BaseModel):
    x: float  # Normalized 0.0 to 1.0
    y: float  # Normalized 0.0 to 1.0


@router.websocket("/ws/position")
async def position_stream(websocket: WebSocket):
    """
    Streams 3D eye position to the frontend to check if user is ~90cm away.
    React should subscribe to this for Step 1b.
    """
    await websocket.accept()
    
    # --- MAC OS / DEV MODE MOCK ---
    if not TOBII_PRO_AVAILABLE:
        try:
            # Simulate a user slowly moving into the 90cm (900mm) sweet spot
            mock_z = 1200.0 
            while True:
                mock_z = max(900.0, mock_z - 5.0)  # Move closer over time
                
                payload = {
                    "left_eye": {"x": 0.5, "y": 0.5, "z": mock_z},
                    "right_eye": {"x": 0.5, "y": 0.5, "z": mock_z},
                    "distance_mm": mock_z,
                    "status": "optimal" if 850 <= mock_z <= 950 else "adjust"
                }
                await websocket.send_json(payload)
                await asyncio.sleep(0.05)  # 20 FPS
        except WebSocketDisconnect:
            return

    # --- REAL HARDWARE MODE ---
    try:
        found_trackers = tr.find_all_eyetrackers()
        if not found_trackers:
            await websocket.close(code=1008, reason="No tracker found")
            return
            
        tracker = found_trackers[0]
        
        # Queue to bridge Tobii's callback thread to FastAPI's async loop
        queue = asyncio.Queue()

        def gaze_data_callback(gaze_data):
            # Extract 3D user coordinates (Z is distance from tracker)
            left_pos = gaze_data['left_eye']['gaze_origin']['position_in_user_coordinates']
            right_pos = gaze_data['right_eye']['gaze_origin']['position_in_user_coordinates']
            
            # Average distance if both eyes are valid
            valid_z = [z for z in (left_pos[2], right_pos[2]) if not float('nan')]
            avg_z = sum(valid_z) / len(valid_z) if valid_z else 0.0
            
            queue.put_nowait({
                "left_eye": {"x": left_pos[0], "y": left_pos[1], "z": left_pos[2]},
                "right_eye": {"x": right_pos[0], "y": right_pos[1], "z": right_pos[2]},
                "distance_mm": avg_z,
                "status": "optimal" if 850 <= avg_z <= 950 else "adjust"
            })

        tracker.subscribe_to(tr.EYETRACKER_GAZE_DATA, gaze_data_callback, as_dictionary=True)

        try:
            while True:
                payload = await queue.get()
                await websocket.send_json(payload)
        except WebSocketDisconnect:
            tracker.unsubscribe_from(tr.EYETRACKER_GAZE_DATA, gaze_data_callback)
    
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
        await websocket.close()


@router.post("/start")
async def start_calibration():
    """Step 2: Triggered when the React 20-second overlay appears."""
    global calibration_instance, current_tracker
    
    if not TOBII_PRO_AVAILABLE:
        return {"status": "mock_calibration_started"}

    found_trackers = tr.find_all_eyetrackers()
    if not found_trackers:
        raise HTTPException(status_code=400, detail="No eye tracker connected.")
        
    current_tracker = found_trackers[0]
    calibration_instance = tr.ScreenBasedCalibration(current_tracker)
    calibration_instance.enter_calibration_mode()
    
    return {"status": "calibration_mode_active"}


@router.post("/collect")
async def collect_calibration_point(point: PointRequest):
    """
    Called by React when the dot pauses at one of the 5 positions.
    React should send normalized coordinates (e.g., Center = x:0.5, y:0.5).
    """
    if not TOBII_PRO_AVAILABLE:
        await asyncio.sleep(0.5)  # Simulate collection time
        return {"status": "mock_point_collected", "point": point.dict()}

    if not calibration_instance:
        raise HTTPException(status_code=400, detail="Calibration not started.")

    # Tells the hardware to calculate eye angles for this specific screen coordinate
    status = calibration_instance.collect_data(point.x, point.y)
    
    if status != tr.CALIBRATION_STATUS_SUCCESS:
        return {"status": "failed_to_collect", "reason": str(status)}
        
    return {"status": "success", "point": point.dict()}


@router.post("/compute")
async def compute_calibration():
    """Step 3: Called after all 5 points are collected to get validation data."""
    global calibration_instance
    
    if not TOBII_PRO_AVAILABLE:
        # Return mock Pass/Fail data to populate Step 3 of your UI
        return {
            "status": "success",
            "overall_quality": "Pass",
            "accuracy_degrees": 0.45,
            "precision_degrees": 0.12,
            "points": [
                {"x": 0.5, "y": 0.5, "valid": True},
                {"x": 0.1, "y": 0.1, "valid": True},
                {"x": 0.9, "y": 0.1, "valid": True},
                {"x": 0.1, "y": 0.9, "valid": True},
                {"x": 0.9, "y": 0.9, "valid": True},
            ]
        }

    if not calibration_instance:
        raise HTTPException(status_code=400, detail="Calibration not started.")

    result = calibration_instance.compute_and_apply()
    calibration_instance.leave_calibration_mode()
    calibration_instance = None

    if result.status != tr.CALIBRATION_STATUS_SUCCESS:
        return {"status": "failed", "overall_quality": "Fail"}

    # Extract hardware precision data from the Tobii result object
    points_data = []
    for point in result.calibration_points:
        points_data.append({
            "x": point.position_on_display_area[0],
            "y": point.position_on_display_area[1],
            "valid": len(point.calibration_samples) > 0
        })

    # You can calculate actual average accuracy from point.calibration_samples here
    # For now, we return the parsed structure React needs.
    return {
        "status": "success",
        "overall_quality": "Pass",
        "points": points_data
    }