import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DrawSectionProps {
  imageUrl: string;
  generateImage: (prompt: string) => void;
}

export const DrawSection: React.FC<DrawSectionProps> = ({ imageUrl, generateImage }) => {
  const [prompt, setPrompt] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const spinnerUrl = 'https://i.ibb.co/S5S7MtM/loading-spinner.gif';

  useEffect(() => {
    setLocalImageUrl(imageUrl);
  }, [imageUrl]);

  const handleGenerateImage = () => {
    setLocalImageUrl(spinnerUrl);
    generateImage(prompt);
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md space-y-6 h-[calc(100vh-4rem)]">
      <h2 className="text-3xl font-extrabold text-gray-800">Crea tus imagenes con IA</h2>
      <div className="flex w-full max-w-xl space-x-4">
        <Input
          type="text"
          placeholder="Ingresa una descripción para tu imagen"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
        />
        <Button
          onClick={handleGenerateImage}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Generate
        </Button>
      </div>
      {localImageUrl && (
        <div className="mt-6 w-full flex justify-center">
          <img
            src={localImageUrl}
            alt={"Imagen generada" + prompt}
            className="max-w-full max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};
