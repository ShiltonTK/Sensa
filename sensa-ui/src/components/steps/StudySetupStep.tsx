import { useState } from 'react';
import { Monitor, Smartphone, Wifi, FlaskConical, Eye, Activity, Heart, Brain, CheckSquare } from 'lucide-react';

const STUDY_GOALS = [
  { 
    id: 'cog_load', 
    title: 'Cognitive Load', 
    sensors: 'Sensors: EEG + EDA', 
    metrics: 'HR ↑, RMSSD ↓, EDA ↑' 
  },
  { 
    id: 'emotion', 
    title: 'Emotional Engagement / Arousal', 
    sensors: 'Sensors: EDA (+ ECG optional)', 
    metrics: 'EDA peaks ↑, EDA AUC ↑, HR slight ↑' 
  },
  { 
    id: 'decision', 
    title: 'Decision-Making Behavior', 
    sensors: 'Sensors: Eye Tracking + EEG', 
    metrics: 'Time to first fixation (TTFF), gaze transitions, HR variability changes' 
  },
  { 
    id: 'usability', 
    title: 'Usability Friction / Interaction Difficulty', 
    sensors: 'Sensors: EDA + Eye Tracking', 
    metrics: 'EDA spikes, HR ↑, repeated gaze shifts, longer fixations' 
  }
];

const AVAILABLE_EQUIPMENT = [
  { id: 'eye', name: 'Eye Tracker', desc: 'Track gaze patterns and visual attention', icon: Eye },
  { id: 'gsr', name: 'GSR Sensor (EDA)', desc: 'Measure emotional arousal and stress', icon: Activity },
  { id: 'ecg', name: 'Heart Rate Sensor (ECG)', desc: 'Monitor heart activity and cognitive load', icon: Heart },
  { id: 'eeg', name: 'Brain Waves Sensor (EEG)', desc: 'Capture neural activity and cognitive states', icon: Brain }
];

export default function StudySetupStep({ 
  onRecommend, 
  onManual 
}: { 
  onRecommend: () => void;
  onManual: () => void;
}) {
  const [interfaceType, setInterfaceType] = useState('web'); 
  const [environmentType, setEnvironmentType] = useState('lab');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['cog_load', 'emotion']);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['eye', 'gsr', 'ecg', 'eeg']);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const toggleEquipment = (id: string) => {
    setSelectedEquipment(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Row: Name & Type */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Study Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="Lorem Ipsum"
            defaultValue="Test Study"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Study Type <span className="text-red-500">*</span></label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 appearance-none">
            <option value="screen">Screen Based Usability Testing</option>
            <option value="mobile">Mobile App Usability Testing</option>
          </select>
        </div>
      </div>

      {/* NEW: Detailed Study Goal Checkboxes */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/30 p-5">
        <label className="mb-1 block text-sm font-medium text-gray-900">Study Goal <span className="text-red-500">*</span></label>
        <p className="mb-4 text-sm text-gray-500">The main purpose of this study is to measure:</p>
        
        <div className="space-y-4">
          {STUDY_GOALS.map((goal) => (
            <div key={goal.id} className="flex items-start justify-between gap-4">
              <label className="flex cursor-pointer items-start gap-3 flex-1">
                <input 
                  type="checkbox" 
                  checked={selectedGoals.includes(goal.id)}
                  onChange={() => toggleGoal(goal.id)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600" 
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-800">{goal.title}</span>
                  <span className="block text-xs text-gray-500">{goal.sensors}</span>
                </div>
              </label>
              <div className="hidden text-right text-xs text-gray-500 sm:block max-w-[250px]">
                {goal.metrics}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Available Equipment Selection */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Available Equipment <span className="text-red-500">*</span></label>
        <p className="mb-4 text-sm text-gray-500">What hardware do you have available?</p>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {AVAILABLE_EQUIPMENT.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedEquipment.includes(item.id);
            
            return (
              <div 
                key={item.id}
                onClick={() => toggleEquipment(item.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                  isSelected 
                    ? 'border-violet-600 bg-violet-50/50' 
                    : 'border-gray-200 bg-white hover:border-violet-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-violet-600' : 'text-gray-500'}`} />
                  <div>
                    <h4 className={`font-semibold text-sm ${isSelected ? 'text-violet-900' : 'text-gray-900'}`}>
                      {item.name}
                    </h4>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-violet-700' : 'text-gray-500'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  isSelected ? 'border-violet-600 bg-white' : 'border-gray-300 bg-white'
                }`}>
                  {isSelected && <CheckSquare className="h-3.5 w-3.5 text-violet-600 rounded-sm" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interface Type Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">Interface Type <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button 
            onClick={() => setInterfaceType('web')}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-6 transition-colors ${
              interfaceType === 'web' ? 'border-2 border-violet-600 bg-violet-50/30 text-violet-700' : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <Monitor className="h-8 w-8" />
            <span className="font-medium">Web Application</span>
          </button>
          <button 
            onClick={() => setInterfaceType('mobile')}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-6 transition-colors ${
              interfaceType === 'mobile' ? 'border-2 border-violet-600 bg-violet-50/30 text-violet-700' : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <Smartphone className="h-8 w-8" />
            <span className="font-medium">Mobile Application</span>
          </button>
        </div>
      </div>

      {/* Environment Type Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">Test Environment <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           <button 
            onClick={() => setEnvironmentType('remote')}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-6 transition-colors ${
              environmentType === 'remote' ? 'border-2 border-violet-600 bg-violet-50/30 text-violet-700' : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <Wifi className="h-8 w-8" />
            <span className="font-medium">Remote Environment</span>
          </button>
          <button 
            onClick={() => setEnvironmentType('lab')}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-6 transition-colors ${
              environmentType === 'lab' ? 'border-2 border-violet-600 bg-violet-50/30 text-violet-700' : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <FlaskConical className="h-8 w-8" />
            <span className="font-medium">Lab Environment</span>
          </button>
        </div>
      </div>

      {/* NEW: Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button 
          onClick={onManual}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Proceed to Manual Sensor Selection
        </button>
        <button 
          onClick={onRecommend}
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Recommend Sensors
        </button>
      </div>

    </div>
  );
}