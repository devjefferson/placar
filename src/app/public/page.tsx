'use client';

import { useState, useEffect } from 'react';
import { Team, Match } from '@/types';
import { StorageService } from '@/services/storageService';
import { 
  sortTeamsByRanking, 
  getTopScorer, 
  getMostCardsPlayer, 
  calculateTeamPoints,
  calculateGoalDifference 
} from '@/utils/helpers';

export default function PublicPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedTeams = StorageService.getTeams();
    const loadedMatches = StorageService.getMatches();
    setTeams(loadedTeams);
    setMatches(loadedMatches);
  };

  const sortedTeams = sortTeamsByRanking(teams, matches);
  const topScorer = getTopScorer(teams);
  const mostCardsPlayer = getMostCardsPlayer(teams);

  const filteredTeams = sortedTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Placar Esportivo</h1>
          <p className="text-xl text-gray-600">Ranking e Estatísticas dos Times</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar times..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 font-medium bg-white hover:border-gray-400 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top Scorer */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              ⚽ Artilheiro
            </h2>
            {topScorer ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-yellow-600">⚽</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{topScorer.name}</h3>
                <p className="text-gray-600">{topScorer.goals} gols</p>
                <p className="text-sm text-gray-500">
                  {teams.find(t => t.players.some(p => p.id === topScorer.id))?.name}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">Nenhum jogador cadastrado</p>
            )}
          </div>

          {/* Most Cards */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              🟨 Mais Cartões
            </h2>
            {mostCardsPlayer ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-red-600">🟥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{mostCardsPlayer.name}</h3>
                <p className="text-gray-600">
                  {mostCardsPlayer.yellowCards + mostCardsPlayer.redCards} cartões
                </p>
                <p className="text-sm text-gray-500">
                  {teams.find(t => t.players.some(p => p.id === mostCardsPlayer.id))?.name}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">Nenhum jogador cadastrado</p>
            )}
          </div>
        </div>

        {/* Teams Ranking */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">🏆 Ranking dos Times</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    J
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    V
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    D
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GP
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GC
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SG
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeams.map((team, index) => (
                  <tr 
                    key={team.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTeam(team)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}º
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={team.shield}
                          alt={team.name}
                          className="w-8 h-8 object-contain mr-3"
                        />
                        <span className="text-sm font-medium text-gray-900">{team.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                      {calculateTeamPoints(team)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {team.wins + team.draws + team.losses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-medium">
                      {team.wins}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-yellow-600 font-medium">
                      {team.draws}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600 font-medium">
                      {team.losses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {team.goalsFor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {team.goalsAgainst}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      <span className={calculateGoalDifference(team) > 0 ? 'text-green-600' : calculateGoalDifference(team) < 0 ? 'text-red-600' : 'text-gray-600'}>
                        {calculateGoalDifference(team) > 0 ? '+' : ''}{calculateGoalDifference(team)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTeams.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum time encontrado com essa busca.' : 'Nenhum time cadastrado ainda.'}
              </p>
            </div>
          )}
        </div>

        {/* Team Details Modal */}
        {selectedTeam && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedTeam.shield}
                      alt={selectedTeam.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedTeam.name}</h3>
                      <p className="text-gray-600">
                        {selectedTeam.players.length} jogador{selectedTeam.players.length !== 1 ? 'es' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Team Stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas do Time</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pontos:</span>
                        <span className="font-medium">{calculateTeamPoints(selectedTeam)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vitórias:</span>
                        <span className="font-medium text-green-600">{selectedTeam.wins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Empates:</span>
                        <span className="font-medium text-yellow-600">{selectedTeam.draws}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Derrotas:</span>
                        <span className="font-medium text-red-600">{selectedTeam.losses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gols Pró:</span>
                        <span className="font-medium">{selectedTeam.goalsFor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gols Contra:</span>
                        <span className="font-medium">{selectedTeam.goalsAgainst}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saldo de Gols:</span>
                        <span className={`font-medium ${calculateGoalDifference(selectedTeam) > 0 ? 'text-green-600' : calculateGoalDifference(selectedTeam) < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {calculateGoalDifference(selectedTeam) > 0 ? '+' : ''}{calculateGoalDifference(selectedTeam)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Players List */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Jogadores</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedTeam.players.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-700">{player.number}</span>
                            </div>
                            <span className="font-medium text-gray-900">{player.name}</span>
                          </div>
                          <div className="flex space-x-2 text-sm">
                            <span className="text-green-600">⚽ {player.goals}</span>
                            <span className="text-yellow-600">🟨 {player.yellowCards}</span>
                            <span className="text-red-600">🟥 {player.redCards}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 