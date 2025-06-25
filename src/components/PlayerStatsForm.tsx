'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';

interface PlayerStatsFormProps {
  player: Player;
  onSubmit: (player: Player) => void;
  onCancel: () => void;
}

export default function PlayerStatsForm({ player, onSubmit, onCancel }: PlayerStatsFormProps) {
  const [goals, setGoals] = useState(player.goals);
  const [yellowCards, setYellowCards] = useState(player.yellowCards);
  const [redCards, setRedCards] = useState(player.redCards);

  useEffect(() => {
    setGoals(player.goals);
    setYellowCards(player.yellowCards);
    setRedCards(player.redCards);
  }, [player]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedPlayer: Player = {
      ...player,
      goals,
      yellowCards,
      redCards
    };

    onSubmit(updatedPlayer);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Estatísticas de {player.name}
        </h3>
      </div>

      <div>
        <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
          ⚽ Gols Marcados
        </label>
        <input
          type="number"
          id="goals"
          value={goals}
          onChange={(e) => setGoals(Math.max(0, parseInt(e.target.value) || 0))}
          min="0"
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 font-medium transition-all duration-200"
        />
      </div>

      <div>
        <label htmlFor="yellowCards" className="block text-sm font-medium text-gray-700 mb-2">
          🟨 Cartões Amarelos
        </label>
        <input
          type="number"
          id="yellowCards"
          value={yellowCards}
          onChange={(e) => setYellowCards(Math.max(0, parseInt(e.target.value) || 0))}
          min="0"
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 font-medium transition-all duration-200"
        />
      </div>

      <div>
        <label htmlFor="redCards" className="block text-sm font-medium text-gray-700 mb-2">
          🟥 Cartões Vermelhos
        </label>
        <input
          type="number"
          id="redCards"
          value={redCards}
          onChange={(e) => setRedCards(Math.max(0, parseInt(e.target.value) || 0))}
          min="0"
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 font-medium transition-all duration-200"
        />
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
          className="px-6 py-3 text-sm font-medium text-white bg-green-600 border-2 border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm"
        >
          Atualizar Estatísticas
        </button>
      </div>
    </form>
  );
} 