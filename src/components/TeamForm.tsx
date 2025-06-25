'use client';

import { useState, useEffect } from 'react';
import { Team } from '@/types';
import { generateId } from '@/utils/helpers';
import ImageUpload from './ImageUpload';

interface TeamFormProps {
  team?: Team;
  onSubmit: (team: Team) => void;
  onCancel: () => void;
}

export default function TeamForm({ team, onSubmit, onCancel }: TeamFormProps) {
  const [name, setName] = useState(team?.name || '');
  const [shield, setShield] = useState(team?.shield || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (team) {
      setName(team.name);
      setShield(team.shield);
    }
  }, [team]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome do time é obrigatório';
    }

    if (!shield) {
      newErrors.shield = 'Escudo do time é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const teamData: Team = {
      id: team?.id || generateId(),
      name: name.trim(),
      shield,
      players: team?.players || [],
      wins: team?.wins || 0,
      draws: team?.draws || 0,
      losses: team?.losses || 0,
      goalsFor: team?.goalsFor || 0,
      goalsAgainst: team?.goalsAgainst || 0
    };

    onSubmit(teamData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Time
        </label>
        <input
          type="text"
          id="name"
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
          placeholder="Digite o nome do time"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>
        )}
      </div>

      <ImageUpload
        currentImage={shield}
        onImageChange={setShield}
        label="Escudo do Time"
      />
      {errors.shield && (
        <p className="text-sm text-red-600 font-medium">{errors.shield}</p>
      )}

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
          {team ? 'Atualizar' : 'Criar'} Time
        </button>
      </div>
    </form>
  );
} 