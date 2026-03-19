import { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';

const CHECKLIST_ITEMS = [
  {
    id: 'seated',
    title: 'Participant seated correctly',
    description: 'Participant is comfortably seated at the workstation with proper posture'
  },
  {
    id: 'lighting',
    title: 'Proper Lighting',
    description: 'Room lighting is consistent and adequate for sensor and eye tracking detection'
  },
  {
    id: 'visibility',
    title: 'Sensor Visibility',
    description: 'All sensors are accessible and visible for calibration'
  },
  {
    id: 'cleaning', // <--- NEW ITEM
    title: 'Clean and wipe biometric sensors',
    description: 'All sensors to be used should be wiped with an alcohol swab to ensure easy calibration.'
  }
];

export default function EnvironmentReadinessStep({ onContinue }: { onContinue: () => void }) {
  // State for the text inputs
  const [participantName, setParticipantName] = useState('Ali Khan');
  const [participantId, setParticipantId] = useState('SENS-PRJ001-PRT001');

  // State to track which checklist items are completed
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);

  // Toggle a checklist item
  const toggleCheck = (id: string) => {
    setCompletedChecks(prev => 
      prev.includes(id) 
        ? prev.filter(checkId => checkId !== id) 
        : [...prev, id]
    );
  };

  // Check if all items are completed
  const isAllComplete = completedChecks.length === CHECKLIST_ITEMS.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Participant Info Inputs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700">
            Participant Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700">
            Participant ID <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
          />
        </div>
      </div>

      {/* Interactive Checklist */}
      <div className="space-y-4">
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = completedChecks.includes(item.id);
          
          return (
            <div 
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-5 transition-all duration-200 ${
                isChecked 
                  ? 'border-violet-600 bg-violet-50/30' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Custom Checkbox */}
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                isChecked 
                  ? 'border-violet-600 bg-white text-violet-600' 
                  : 'border-gray-300 bg-white'
              }`}>
                {isChecked && <Check className="h-3.5 w-3.5" />}
              </div>
              
              {/* Text Content */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Banner (Only visible when all checks are complete) */}
      {isAllComplete && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800 animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          All environment checks complete
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={onContinue}
          disabled={!isAllComplete}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
            isAllComplete 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-violet-100 text-white cursor-not-allowed opacity-80'
          }`}
        >
          Start Sensor Calibration
        </button>
      </div>

    </div>
  );
}