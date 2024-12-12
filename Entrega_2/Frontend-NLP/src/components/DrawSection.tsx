import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DrawSectionProps {
  imageUrl: string;
  generateImage: (prompt: string) => void;
}

export const DrawSection: React.FC<DrawSectionProps> = ({imageUrl, generateImage}) => {
  const [prompt, setPrompt] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const spinnerUrl = 'https://i.ibb.co/S5S7MtM/loading-spinner.gif';
  useEffect(() => {
    setLocalImageUrl(imageUrl);
  }, [imageUrl]);

  const handleGenerateImage = () => {
    setLocalImageUrl(spinnerUrl);
    generateImage(prompt);
  }

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Draw</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Escribe el prompt para la imagen"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button onClick={handleGenerateImage}>Generate</Button>
      </div>
      {localImageUrl && (
        <div className="mt-4">
          <img src={localImageUrl} alt="Generated image" className="items-center" />
        </div>
      )
      }
    </div>
  );
};

