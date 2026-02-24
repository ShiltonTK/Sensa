import { useState } from 'react';
import { Monitor, Smartphone, Wifi, FlaskConical } from 'lucide-react';

export default function StudySetupStep({ onContinue }: { onContinue: () => void }) {
  // to remember selected state
  const [interfaceType, setInterfaceType] = useState('web'); // defaults to 'web'
  const [environmentType, setEnvironmentType] = useState('lab'); // defaults to 'lab'

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Row: Name & Type */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Study Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="Lorem Ipsum"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Study Type <span className="text-red-500">*</span></label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 appearance-none">
            <option value="" disabled selected>Select study type</option>
            <option value="usability">Usability Testing</option>
            <option value="a_b">A/B Testing</option>
          </select>
        </div>
      </div>

      {/* Study Goal Checkboxes */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-5">
        <label className="mb-1 block text-sm font-medium text-gray-900">Study Goal <span className="text-red-500">*</span></label>
        <p className="mb-4 text-sm text-gray-500">What is the main purpose of this study?</p>
        
        <div className="space-y-3">
          {['Measure Cognitive Load', 'Measure Emotional Engagement', 'Measure Gaze Patterns'].map((goal) => (
            <label key={goal} className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600" />
              <span className="text-sm text-gray-700">{goal}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Interface Type Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">Interface Type <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          <button 
            onClick={() => setInterfaceType('web')}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-6 transition-colors ${
              interfaceType === 'web'
                ? 'border-2 border-violet-600 bg-violet-50/30 text-violet-700'
                : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <Monitor className="h-8 w-8" />
            <span className="font-medium">Web Application</span>
          </button>
          
          <button 
            onClick={() => setInterfaceType('mobile')}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-6 transition-colors ${
              interfaceType === 'mobile'
                ? 'border-2 border-violet-600 bg-violet-50/30 text-violet-700'
                : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <Smartphone className="h-8 w-8" />
            <span className="font-medium">Mobile Application</span>
          </button>
        </div>
      </div>

      {/* Environment Type Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">Environment Type <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           
           <button 
            onClick={() => setEnvironmentType('remote')}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-6 transition-colors ${
              environmentType === 'remote'
                ? 'border-2 border-violet-600 bg-violet-50/30 text-violet-700'
                : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <Wifi className="h-8 w-8" />
            <span className="font-medium">Remote Environment</span>
          </button>
          
          <button 
            onClick={() => setEnvironmentType('lab')}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-6 transition-colors ${
              environmentType === 'lab'
                ? 'border-2 border-violet-600 bg-violet-50/30 text-violet-700'
                : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <FlaskConical className="h-8 w-8" />
            <span className="font-medium">Lab Environment</span>
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={onContinue}
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Continue to Sensor Selection
        </button>
      </div>

    </div>
  );
}