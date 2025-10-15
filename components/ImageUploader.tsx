
import React, { useRef, useState, useEffect } from 'react';
import { UploadIcon, PredictIcon, ResetIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onPredict: () => void;
  imageFile: File | null;
  error: string | null;
  onReset: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onPredict, imageFile, error, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {previewUrl ? (
        <div className="w-full max-w-sm rounded-lg overflow-hidden border-2 border-dashed border-slate-300 p-2">
          <img src={previewUrl} alt="Nailbed preview" className="w-full h-auto object-cover rounded-md" />
        </div>
      ) : (
        <div 
          onClick={handleClick} 
          className="w-full max-w-sm h-64 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 hover:border-blue-500 transition-colors"
        >
          <UploadIcon className="w-12 h-12 mb-2" />
          <p className="font-semibold">Click to upload image</p>
          <p className="text-sm">or drag and drop</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex items-center space-x-4 mt-4">
        {imageFile && (
           <button
            onClick={onReset}
            className="flex items-center justify-center px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition-all duration-300"
          >
            <ResetIcon className="w-5 h-5 mr-2" />
            Reset
          </button>
        )}
        <button
          onClick={onPredict}
          disabled={!imageFile}
          className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <PredictIcon className="w-6 h-6 mr-2" />
          Predict Hemoglobin
        </button>
      </div>
    </div>
  );
};
