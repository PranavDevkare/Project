
import React from 'react';
import { WarningIcon } from './Icons';

export const Disclaimer: React.FC = () => {
  return (
    <div className="flex items-start p-4 text-sm bg-yellow-50 border border-yellow-200 rounded-lg">
      <WarningIcon className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-bold text-yellow-800">For Informational Purposes Only</h3>
        <p className="text-yellow-700 mt-1">
          This AI-powered prediction is not a medical diagnosis. It is an experimental tool and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.
        </p>
      </div>
    </div>
  );
};
