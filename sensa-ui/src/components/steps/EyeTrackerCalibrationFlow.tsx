import { useState, useEffect } from 'react';
import { CheckCircle2, Check, XCircle, AlertCircle } from 'lucide-react';

export default function EyeTrackerCalibrationFlow({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(1);
  
  // Step 1 State: Positioning
  const [positionReady, setPositionReady] = useState(false);

  // Step 2 State: Calibration
  const [calibrationPhase, setCalibrationPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [activeDot, setActiveDot] = useState(-1);

  // Step 3 State: Validation
  // We default to 'passed', but let the user toggle it to see the 'failed' state design
  const [validationStatus, setValidationStatus] = useState<'passed' | 'failed'>('passed');

  // Simulate Step 2 Calibration Sequence
  useEffect(() => {
    if (calibrationPhase === 'running') {
      let currentDot = 0;
      const interval = setInterval(() => {
        setActiveDot(currentDot);
        currentDot++;
        if (currentDot > 4) {
          clearInterval(interval);
          setTimeout(() => {
            setCalibrationPhase('done');
            setStep(3); // Auto-advance to validation
          }, 500);
        }
      }, 600); // 600ms per dot
      return () => clearInterval(interval);
    }
  }, [calibrationPhase]);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        
        {/* HEADER & STEPPER */}
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-gray-100 pb-6 md:flex-row md:items-end">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Step {step}: <br/>
              {step === 1 && 'Position the participant'}
              {step === 2 && 'Run Calibration'}
              {step === 3 && 'Validate Calibration Results'}
            </h3>
          </div>

          {/* Stepper Graphic */}
          <div className="flex items-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    step > i ? 'border-violet-600 bg-violet-600 text-white' : 
                    step === i ? 'border-violet-600 bg-white text-violet-600' : 
                    'border-gray-300 bg-white'
                  }`}>
                    {step > i ? <Check className="h-3 w-3" /> : <div className={`h-2 w-2 rounded-full ${step === i ? 'bg-violet-600' : 'bg-transparent'}`} />}
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 uppercase">
                    {i === 1 && 'Positioning'}
                    {i === 2 && 'Calibration'}
                    {i === 3 && 'Validation'}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`h-[2px] w-16 mb-6 ${step > i ? 'bg-violet-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ==================== STEP 1: POSITIONING ==================== */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              The eye tracker needs to detect both eyes clearly. Your position before calibration directly affects accuracy.
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Column: Instructions */}
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-gray-50/50">
                   <h4 className="border-b border-gray-200 bg-gray-200 px-4 py-2 text-xs font-bold uppercase text-gray-700">Instructions</h4>
                   <ul className="space-y-4 p-4 text-sm text-gray-700">
                     <li className="flex items-start gap-3">
                       <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-violet-600">
                         <div className="h-1.5 w-1.5 rounded-full bg-violet-600"></div>
                       </div>
                       <div>
                         <span className="font-semibold text-gray-900 block">Sit directly in front of the screen</span>
                         <span className="text-gray-500 text-xs">Position yourself so the screen is at eye level</span>
                       </div>
                     </li>
                     <li className="flex items-start gap-3">
                       <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-violet-600">
                         <div className="h-1.5 w-1.5 rounded-full bg-violet-600"></div>
                       </div>
                       <div>
                         <span className="font-semibold text-gray-900 block">Maintain approximately 90 cm distance</span>
                         <span className="text-gray-500 text-xs">Roughly an arm's length from the monitor</span>
                       </div>
                     </li>
                     <li className="flex items-start gap-3">
                       <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-violet-600">
                         <div className="h-1.5 w-1.5 rounded-full bg-violet-600"></div>
                       </div>
                       <div>
                         <span className="font-semibold text-gray-900 block">Look straight ahead</span>
                         <span className="text-gray-500 text-xs">Keep your head still and face the screen directly</span>
                       </div>
                     </li>
                   </ul>
                </div>
                
                {/* Temporary button to toggle states for demonstration */}
                <button 
                  onClick={() => setPositionReady(!positionReady)}
                  className="text-xs text-violet-600 underline"
                >
                  [Dev] Toggle Eyes Ready State
                </button>
              </div>

              {/* Right Column: Dark Self-Calibration View */}
              <div className="flex flex-col items-center justify-center rounded-xl bg-[#3B3E46] p-8 text-center relative overflow-hidden">
                <div className="absolute top-1/2 w-full border-t border-dashed border-gray-500/30"></div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">optimal range</span>
                
                <div className="z-10 flex gap-8 mb-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className={`h-24 w-16 rounded-full transition-colors duration-500 ${positionReady ? 'bg-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-[#9CA3AF]'}`}></div>
                    <span className="text-xs text-gray-300">Left Eye</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`h-24 w-16 rounded-full transition-colors duration-500 ${positionReady ? 'bg-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-[#9CA3AF]'}`}></div>
                    <span className="text-xs text-gray-300">Right Eye</span>
                  </div>
                </div>

                <div className={`z-10 mb-6 text-sm font-medium ${positionReady ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                  {positionReady ? 'Position looks good' : 'Adjust your position'}
                </div>

                <button 
                  disabled={!positionReady}
                  onClick={() => setStep(2)}
                  className="z-10 w-full max-w-[200px] rounded-lg bg-violet-600 py-3 text-sm font-medium text-white transition-all hover:bg-violet-700 disabled:opacity-50 disabled:bg-violet-400"
                >
                  {positionReady ? 'Go to Calibration' : 'Start Calibration'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 2: RUN CALIBRATION ==================== */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              A series of dots will appear on screen. Follow each dot with your eyes without moving your head. Keep still until each dot disappears. The process takes about 20 seconds.
            </div>

            <div className="relative flex h-80 w-full items-center justify-center rounded-xl bg-gray-200">
              {calibrationPhase === 'idle' && (
                <div className="text-center text-sm font-medium text-gray-600">
                  <div className="mx-auto mb-2 h-8 w-8 rounded-full border-2 border-gray-400"></div>
                  5 calibration targets will appear in sequence
                </div>
              )}

              {/* Calibration Dots Map */}
              <div className="absolute left-8 top-8 h-8 w-8 rounded-full border-2 border-gray-400 bg-transparent transition-colors duration-300" style={{ backgroundColor: activeDot === 0 ? '#7C3AED' : 'transparent', borderColor: activeDot === 0 ? '#7C3AED' : '#9CA3AF' }}></div>
              <div className="absolute right-8 top-8 h-8 w-8 rounded-full border-2 border-gray-400 bg-transparent transition-colors duration-300" style={{ backgroundColor: activeDot === 1 ? '#7C3AED' : 'transparent', borderColor: activeDot === 1 ? '#7C3AED' : '#9CA3AF' }}></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-2 border-gray-400 bg-transparent transition-colors duration-300" style={{ backgroundColor: activeDot === 2 ? '#7C3AED' : 'transparent', borderColor: activeDot === 2 ? '#7C3AED' : '#9CA3AF' }}></div>
              <div className="absolute bottom-8 left-8 h-8 w-8 rounded-full border-2 border-gray-400 bg-transparent transition-colors duration-300" style={{ backgroundColor: activeDot === 3 ? '#7C3AED' : 'transparent', borderColor: activeDot === 3 ? '#7C3AED' : '#9CA3AF' }}></div>
              <div className="absolute bottom-8 right-8 h-8 w-8 rounded-full border-2 border-gray-400 bg-transparent transition-colors duration-300" style={{ backgroundColor: activeDot === 4 ? '#7C3AED' : 'transparent', borderColor: activeDot === 4 ? '#7C3AED' : '#9CA3AF' }}></div>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={() => setCalibrationPhase('running')}
                disabled={calibrationPhase !== 'idle'}
                className="rounded-lg bg-violet-600 px-8 py-2.5 text-sm font-medium text-white transition-all hover:bg-violet-700 disabled:opacity-50"
              >
                {calibrationPhase === 'idle' ? 'Start Calibration' : 'Calibrating...'}
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 3: VALIDATION ==================== */}
        {step === 3 && (
          <div className="space-y-6">
            
            {/* Banner */}
            <div className={`flex items-center justify-between rounded-lg border p-4 text-sm font-medium ${
              validationStatus === 'passed' ? 'border-green-300 bg-green-50 text-green-800' : 'border-red-300 bg-red-50 text-red-800'
            }`}>
              <div className="flex items-center gap-3">
                {validationStatus === 'passed' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                <div>
                  <span className="block font-bold">{validationStatus === 'passed' ? 'Eye tracker successfully calibrated.' : 'Calibration quality too low. Please recalibrate.'}</span>
                  {validationStatus === 'failed' && <span className="text-xs font-normal opacity-80">Low calibration quality may lead to inaccurate results and harm the integrity of the gathered data.</span>}
                </div>
              </div>
              <AlertCircle className={`h-5 w-5 ${validationStatus === 'passed' ? 'text-green-400' : 'text-red-400'}`} />
            </div>

            {/* Actions Top Row */}
            <div className="flex items-center justify-between">
              {validationStatus === 'passed' ? (
                <button onClick={onFinish} className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700">Accept and Continue</button>
              ) : (
                <button onClick={() => setStep(1)} className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Recalibrate Eye Tracker
                </button>
              )}
              <button className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Run Validation Check</button>
            </div>

            {/* Validation Diagram */}
            <div className="relative flex h-80 w-full items-center justify-center rounded-xl bg-gray-200 overflow-hidden">
               {/* Center Result */}
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-12 text-sm font-medium" style={{ color: validationStatus === 'passed' ? '#10B981' : '#EF4444' }}>
                 Calibration point accuracy: {validationStatus === 'passed' ? '0.48°' : '1.24°'}
               </div>

               {/* Simulated Datapoints - we render clusters of dots. Green for passed, Red for failed */}
               {[
                 { top: '15%', left: '15%' }, { top: '15%', right: '15%' },
                 { top: '50%', left: '50%', center: true },
                 { bottom: '15%', left: '15%' }, { bottom: '15%', right: '15%' }
               ].map((pos, i) => (
                 <div key={i} className="absolute flex items-center justify-center" style={{ ...pos, transform: pos.center ? 'translate(-50%, -50%)' : 'none' }}>
                   {/* Base Target */}
                   <div className="absolute h-8 w-8 rounded-full border-2 border-gray-400"></div>
                   {/* Scattered fixations */}
                   <div className={`absolute h-3 w-3 rounded-full bg-gray-400 opacity-60 translate-x-3 -translate-y-2`}></div>
                   <div className={`absolute h-3 w-3 rounded-full bg-gray-400 opacity-60 -translate-x-2 translate-y-3`}></div>
                   <div className={`absolute h-3 w-3 rounded-full bg-gray-400 opacity-60 -translate-x-3 -translate-y-3`}></div>
                   {/* Core cluster bubble */}
                   <div className={`absolute h-6 w-6 rounded-full border border-gray-800 ${validationStatus === 'passed' ? 'bg-[#10B981]' : 'bg-[#EF4444]'} ${validationStatus === 'failed' ? 'translate-x-2 translate-y-1 scale-110' : ''}`}></div>
                 </div>
               ))}
            </div>

            {/* Stats Box */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <h4 className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-xs font-bold uppercase text-gray-700 flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white text-[10px] font-bold text-gray-500">-</span>
                Sensor Status
              </h4>
              <div className="space-y-3 p-4 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-600 flex items-center gap-2"><div className={`h-1.5 w-1.5 rounded-full ${validationStatus === 'passed' ? 'bg-green-500' : 'bg-red-500'}`}></div> Accuracy</span>
                  <span className={`font-semibold ${validationStatus === 'passed' ? 'text-green-600' : 'text-gray-700'}`}>
                    {validationStatus === 'passed' ? '0.48° Good' : '1.24° Poor'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-600 flex items-center gap-2"><div className={`h-1.5 w-1.5 rounded-full ${validationStatus === 'passed' ? 'bg-green-500' : 'bg-red-500'}`}></div> Precision</span>
                  <span className={`font-semibold ${validationStatus === 'passed' ? 'text-green-600' : 'text-gray-700'}`}>
                     {validationStatus === 'passed' ? '0.12° Good' : '0.98° Poor'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-600 flex items-center gap-2"><div className={`h-1.5 w-1.5 rounded-full ${validationStatus === 'passed' ? 'bg-green-500' : 'bg-red-500'}`}></div> Point Passed</span>
                  <span className="font-semibold text-gray-700">
                    {validationStatus === 'passed' ? '5 of 5' : '0 of 5'}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-600 flex items-center gap-2"><div className={`h-1.5 w-1.5 rounded-full ${validationStatus === 'passed' ? 'bg-green-500' : 'bg-red-500'}`}></div> Overall result</span>
                  <span className={`font-bold uppercase ${validationStatus === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
                    {validationStatus === 'passed' ? 'Passed' : 'Failed'}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 p-3">
                 <button 
                  onClick={() => setStep(1)} 
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                 >
                   <AlertCircle className="h-4 w-4" /> Recalibrate Eye Tracker
                 </button>
              </div>
            </div>

            {/* Dev toggle to easily see both designs */}
            <div className="flex justify-end pt-2">
               <button 
                  onClick={() => setValidationStatus(prev => prev === 'passed' ? 'failed' : 'passed')}
                  className="text-xs text-gray-400 underline"
                >
                  [Dev] Toggle Pass/Fail Design State
                </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}