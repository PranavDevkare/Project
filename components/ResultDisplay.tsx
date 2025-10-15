
import React from 'react';
import type { HbPrediction } from '../types';
import { ResetIcon } from './Icons';

interface ResultDisplayProps {
  prediction: HbPrediction;
  onReset: () => void;
}

const getHbStatus = (hbValue: number): { status: string; color: string } => {
  // Typical ranges (can vary). Male: 13.5-17.5 g/dL, Female: 12.0-15.5 g/dL
  // Using a general average here for demonstration.
  if (hbValue < 12.0) return { status: "Low", color: "text-red-500" };
  if (hbValue > 17.5) return { status: "High", color: "text-orange-500" };
  return { status: "Normal", color: "text-green-500" };
};

const HbGauge: React.FC<{ value: number }> = ({ value }) => {
    const minHb = 8;
    const maxHb = 20;
    const percentage = ((value - minHb) / (maxHb - minHb)) * 100;
    const rotation = -90 + (percentage * 1.8);
    const { color } = getHbStatus(value);

    return (
        <div className="relative w-48 h-24 overflow-hidden mx-auto">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-slate-200 rounded-t-full border-b-0"></div>
            <div 
                className="absolute top-0 left-0 w-full h-full border-8 border-transparent rounded-t-full border-b-0"
                style={{
                    clipPath: `path('M 0 100 A 100 100 0 0 1 200 100 L 100 100 Z')`
                }}
            >
                <div 
                    className={`absolute top-0 left-0 w-full h-full border-8 ${color.replace('text-', 'border-')} rounded-t-full border-b-0 transition-transform duration-1000`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                 <span className={`text-4xl font-bold ${color}`}>{value.toFixed(1)}</span>
                 <span className="text-slate-500 text-sm"> g/dL</span>
            </div>
        </div>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ prediction, onReset }) => {
  const { hbValue, analysis, confidence } = prediction;
  const { status, color } = getHbStatus(hbValue);
  
  return (
    <div className="flex flex-col items-center space-y-6 text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-700">Prediction Result</h2>
      
      <HbGauge value={hbValue} />

      <div>
        <p className={`text-2xl font-bold ${color}`}>{status}</p>
        <p className="text-slate-500">Confidence: {Math.round(confidence * 100)}%</p>
      </div>

      <div className="w-full bg-slate-100 p-4 rounded-lg text-left">
        <h3 className="font-semibold text-slate-800 mb-2">AI Analysis</h3>
        <p className="text-slate-600">{analysis}</p>
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-300"
      >
        <ResetIcon className="w-6 h-6 mr-2" />
        Analyze Another Image
      </button>
    </div>
  );
};
