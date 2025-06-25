'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import { generateId } from '@/utils/helpers';

interface PlayerFormProps {
  player?: Player;
  onSubmit: (player: Player) => void;
  onCancel: () => void;
}

export default function PlayerForm({ player, onSubmit, onCancel }: PlayerFormProps) {
  const [name, setName] = useState(player?.name || '');
  const [number, setNumber] = useState(player?.number || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (player) {
      setName(player.name);
      setNumber(player.number.toString());
    }
  }, [player]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome do jogador é obrigatório';
    }

    if (!number || isNaN(Number(number)) || Number(number) < 1 || Number(number) > 99) {
      newErrors.number = 'Número deve ser entre 1 e 99';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const playerData: Player = {
      id: player?.id || generateId(),
      name: name.trim(),
      number: Number(number),
      goals: player?.goals || 0,
      yellowCards: player?.yellowCards || 0,
      redCards: player?.redCards || 0
    };

    onSubmit(playerData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Jogador
        </label>
        <input
          type="text"
          id="playerName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            placeholder-gray-400 text-gray-900 font-medium
            ${errors.name 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500'
            }
          `}
          placeholder="Digite o nome do jogador"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="playerNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Número da Camisa
        </label>
        <input
          type="number"
          id="playerNumber"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          min="1"
          max="99"
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            placeholder-gray-400 text-gray-900 font-medium
            ${errors.number 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500'
            }
          `}
          placeholder="1-99"
        />
        {errors.number && (
          <p className="mt-2 text-sm text-red-600 font-medium">{errors.number}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border-2 border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
        >
          {player ? 'Atualizar' : 'Adicionar'} Jogador
        </button>
      </div>
    </form>
  );
} 