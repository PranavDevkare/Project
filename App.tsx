
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { Disclaimer } from './components/Disclaimer';
import { validateNailbedImage, predictHb } from './services/geminiService';
import type { HbPrediction } from './types';
import { GithubIcon } from './components/Icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<HbPrediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setPrediction(null);
    setError(null);
  };

  const handleReset = () => {
    setImageFile(null);
    setPrediction(null);
    setError(null);
    setIsLoading(false);
  };

  const handlePrediction = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      setLoadingMessage('Validating image...');
      const isValid = await validateNailbedImage(imageFile);
      if (!isValid) {
        setError("Invalid image. Please upload a clear, close-up image of a human nailbed.");
        setIsLoading(false);
        return;
      }

      setLoadingMessage('Analyzing nailbed characteristics...');
      const result = await predictHb(imageFile);
      setPrediction(result);
    } catch (err) {
      console.error(err);
      setError("An error occurred during prediction. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        <header className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">AI Hemoglobin Predictor</h1>
          <p className="mt-2 text-blue-100">Estimate Hb levels from a nailbed image.</p>
        </header>

        <div className="p-6 md:p-8">
          {isLoading ? (
            <Loader message={loadingMessage} />
          ) : prediction ? (
            <ResultDisplay prediction={prediction} onReset={handleReset} />
          ) : (
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              onPredict={handlePrediction} 
              imageFile={imageFile} 
              error={error}
              onReset={handleReset}
            />
          )}
        </div>
        
        <footer className="p-4 bg-slate-50 border-t border-slate-200">
           <Disclaimer />
        </footer>
      </main>
      <a href="https://github.com/google/genai-js" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center text-slate-500 hover:text-slate-700 transition-colors">
        <GithubIcon className="w-5 h-5 mr-2" />
        <span>Powered by Gemini API</span>
      </a>
    </div>
  );
};

export default App;
