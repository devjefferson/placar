'use client';

import { useState, useRef } from 'react';
import { compressImage } from '@/utils/helpers';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (base64: string) => void;
  label?: string;
}

export default function ImageUpload({ currentImage, onImageChange, label = "Escudo do Time" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Verificar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Selecione uma imagem menor que 5MB.');
        return;
      }

      setIsProcessing(true);
      try {
        // Comprimir a imagem antes de converter para base64
        const compressedBase64 = await compressImage(file, 200, 200, 0.7);
        setPreview(compressedBase64);
        onImageChange(compressedBase64);
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        alert('Erro ao processar a imagem. Tente novamente.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert('Por favor, selecione um arquivo de imagem válido.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-gray-50' 
            : preview 
              ? 'border-gray-300 hover:border-gray-400' 
              : 'border-gray-300 hover:border-gray-400'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={isProcessing ? undefined : handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          disabled={isProcessing}
        />
        
        {isProcessing ? (
          <div className="space-y-2">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-sm text-gray-600">
              Processando imagem...
            </p>
          </div>
        ) : preview ? (
          <div className="space-y-2">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-24 w-24 object-contain rounded-lg border"
            />
            <p className="text-sm text-gray-600">
              Clique ou arraste para alterar a imagem
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Clique ou arraste uma imagem aqui
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF até 5MB (será comprimida automaticamente)
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 