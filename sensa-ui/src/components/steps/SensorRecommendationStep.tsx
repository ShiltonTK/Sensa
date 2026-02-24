import { Eye, Activity, Heart, Brain, Lightbulb, CheckSquare } from 'lucide-react';

export default function SensorRecommendationStep({ 
  onAccept, 
  onCustomize 
}: { 
  onAccept: () => void, 
  onCustomize: () => void 
}) {
  
  const recommendedSensors = [
    { name: 'Eye Tracker', device: 'Tobii Eye Tracker 4C', icon: Eye },
    { name: 'GSR Sensor (EDA)', device: 'Biosignalplux', icon: Activity },
    { name: 'Heart Rate Sensor (ECG)', device: 'Biosignalplux', icon: Heart },
    { name: 'Brain Waves Sensor (EEG)', device: 'Biosignalplux', icon: Brain },
  ];

  const metrics = [
    'Fixation Duration', 'Gaze Path', 'Areas of Interest (AOI)', 
    'Skin Conductance Response', 'Arousal Level', 'Heart Rate', 
    'Heart Rate Variability', 'Cognitive Load', 'Brain Activity', 
    'Cognitive State', 'Attention Level'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Recommended Sensors */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-gray-700">Recommended Sensors</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedSensors.map((sensor) => {
            const Icon = sensor.icon;
            return (
              <div key={sensor.name} className="flex flex-col items-start gap-3 rounded-xl border border-green-200 bg-green-50/30 p-4 transition-colors">
                <Icon className="h-6 w-6 text-gray-700" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{sensor.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{sensor.device}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics to Track */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-gray-700">Metrics to Track</h3>
        <div className="flex flex-wrap gap-3">
          {metrics.map((metric) => (
            <div key={metric} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
              <CheckSquare className="h-4 w-4 text-blue-500 rounded" />
              <span className="text-sm text-gray-700">{metric}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Callout */}
      <div className="flex gap-4 rounded-xl border border-blue-200 bg-blue-50/50 p-5">
        <Lightbulb className="h-6 w-6 text-blue-500 shrink-0" />
        <div>
          <h4 className="mb-2 font-semibold text-gray-900 text-sm">Why these recommendations?</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            <li>Eye tracking helps identify visual attention patterns and usability issues</li>
            <li>EDA sensors measure emotional arousal and stress responses in controlled settings</li>
            <li>ECG provides insights into cognitive load and stress during task completion</li>
            <li>EEG captures neural activity for deep cognitive state analysis</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse justify-between gap-4 pt-4 sm:flex-row sm:items-center">
        <button 
          onClick={onCustomize}
          className="rounded-lg bg-violet-50 px-6 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-100 transition-colors"
        >
          Customize Sensor Selection
        </button>
        <button 
          onClick={onAccept}
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Accept Recommendation
        </button>
      </div>

    </div>
  );
}