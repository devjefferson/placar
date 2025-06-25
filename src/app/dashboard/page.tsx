'use client';

import { useState, useEffect } from 'react';
import { Team, Player } from '@/types';
import { StorageService } from '@/services/storageService';
import TeamForm from '@/components/TeamForm';
import PlayerForm from '@/components/PlayerForm';
import PlayerStatsForm from '@/components/PlayerStatsForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showPlayerStatsForm, setShowPlayerStatsForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>(undefined);
  const [editingPlayerStats, setEditingPlayerStats] = useState<Player | undefined>(undefined);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, percentage: 0 });

  useEffect(() => {
    // Verificar autenticação
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadTeams();
      updateStorageInfo();
    }
  }, [isAuthenticated, isLoading, router]);

  const loadTeams = () => {
    const loadedTeams = StorageService.getTeams();
    setTeams(loadedTeams);
    if (loadedTeams.length > 0 && !selectedTeam) {
      setSelectedTeam(loadedTeams[0]);
    }
  };

  const updateStorageInfo = () => {
    const info = StorageService.getStorageInfo();
    setStorageInfo(info);
  };

  const updateSelectedTeam = (updatedTeam: Team) => {
    setSelectedTeam(updatedTeam);
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === updatedTeam.id ? updatedTeam : team
      )
    );
  };

  const handleTeamSubmit = (team: Team) => {
    if (StorageService.saveTeam(team)) {
      loadTeams();
      updateStorageInfo();
      setShowTeamForm(false);
      setEditingTeam(undefined);
    } else {
      alert('Erro ao salvar time. Verifique se há espaço suficiente no armazenamento.');
    }
  };

  const handlePlayerSubmit = (player: Player) => {
    if (!selectedTeam) return;

    let success = false;
    let updatedTeam: Team;

    if (editingPlayer) {
      success = StorageService.updatePlayer(selectedTeam.id, player);
      if (success) {
        updatedTeam = {
          ...selectedTeam,
          players: selectedTeam.players.map(p => 
            p.id === player.id ? player : p
          )
        };
      }
    } else {
      success = StorageService.addPlayer(selectedTeam.id, player);
      if (success) {
        updatedTeam = {
          ...selectedTeam,
          players: [...selectedTeam.players, player]
        };
      }
    }

    if (success && updatedTeam!) {
      // Atualizar estado imediatamente
      updateSelectedTeam(updatedTeam);
      updateStorageInfo();
      setShowPlayerForm(false);
      setEditingPlayer(undefined);
    } else {
      alert('Erro ao salvar jogador. Verifique se há espaço suficiente no armazenamento.');
    }
  };

  const handlePlayerStatsSubmit = (player: Player) => {
    if (!selectedTeam) return;

    if (StorageService.updatePlayer(selectedTeam.id, player)) {
      const updatedTeam = {
        ...selectedTeam,
        players: selectedTeam.players.map(p => 
          p.id === player.id ? player : p
        )
      };
      
      // Atualizar estado imediatamente
      updateSelectedTeam(updatedTeam);
      updateStorageInfo();
      setShowPlayerStatsForm(false);
      setEditingPlayerStats(undefined);
    } else {
      alert('Erro ao atualizar estatísticas. Verifique se há espaço suficiente no armazenamento.');
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Tem certeza que deseja excluir este time? Esta ação não pode ser desfeita.')) {
      if (StorageService.deleteTeam(teamId)) {
        loadTeams();
        updateStorageInfo();
        if (selectedTeam?.id === teamId) {
          setSelectedTeam(teams.find(t => t.id !== teamId) || null);
        }
      } else {
        alert('Erro ao excluir time.');
      }
    }
  };

  const handleDeletePlayer = (playerId: string) => {
    if (!selectedTeam) return;
    
    if (confirm('Tem certeza que deseja excluir este jogador?')) {
      if (StorageService.deletePlayer(selectedTeam.id, playerId)) {
        const updatedTeam = {
          ...selectedTeam,
          players: selectedTeam.players.filter(p => p.id !== playerId)
        };
        
        // Atualizar estado imediatamente
        updateSelectedTeam(updatedTeam);
        updateStorageInfo();
      } else {
        alert('Erro ao excluir jogador.');
      }
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setShowTeamForm(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setShowPlayerForm(true);
  };

  const handleEditPlayerStats = (player: Player) => {
    setEditingPlayerStats(player);
    setShowPlayerStatsForm(true);
  };

  const handleResetData = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      if (StorageService.resetAllData()) {
        setTeams([]);
        setSelectedTeam(null);
        updateStorageInfo();
      } else {
        alert('Erro ao resetar dados.');
      }
    }
  };

  const handleExportData = () => {
    const data = StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'placar_data.json';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleImportData = () => {
    if (StorageService.importData(importData)) {
      loadTeams();
      updateStorageInfo();
      setShowImportModal(false);
      setImportData('');
      alert('Dados importados com sucesso!');
    } else {
      alert('Erro ao importar dados. Verifique o formato do arquivo.');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (vai redirecionar)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard - Placar Esportivo</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Exportar Dados
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Importar Dados
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Resetar Dados
              </button>
            </div>
          </div>

          {/* Storage Info */}
          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Armazenamento Local:</span>
              <span className="text-sm text-gray-600">
                {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.available)} 
                ({storageInfo.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  storageInfo.percentage > 80 ? 'bg-red-500' : 
                  storageInfo.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
              ></div>
            </div>
            {storageInfo.percentage > 80 && (
              <p className="mt-1 text-xs text-red-600">
                ⚠️ Armazenamento quase cheio. Considere remover dados antigos ou usar imagens menores.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Times</h2>
                  <button
                    onClick={() => {
                      setEditingTeam(undefined);
                      setShowTeamForm(true);
                    }}
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    + Novo Time
                  </button>
                </div>

                <div className="space-y-2">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
                        ${selectedTeam?.id === team.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                      `}
                      onClick={() => setSelectedTeam(team)}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={team.shield}
                          alt={team.name}
                          className="w-8 h-8 object-contain"
                        />
                        <span className="font-medium text-gray-900">{team.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTeam(team);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {teams.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum time cadastrado. Clique em &quot;Novo Time&quot; para começar.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Team Details and Players */}
          <div className="lg:col-span-2">
            {selectedTeam ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedTeam.shield}
                        alt={selectedTeam.name}
                        className="w-16 h-16 object-contain"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedTeam.name}</h2>
                        <p className="text-gray-600">
                          {selectedTeam.players.length} jogador{selectedTeam.players.length !== 1 ? 'es' : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingPlayer(undefined);
                        setShowPlayerForm(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      + Novo Jogador
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedTeam.players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-gray-700">{player.number}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{player.name}</h3>
                            <div className="flex space-x-4 text-sm text-gray-600">
                              <span>⚽ {player.goals} gols</span>
                              <span>🟨 {player.yellowCards} amarelos</span>
                              <span>🟥 {player.redCards} vermelhos</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditPlayerStats(player)}
                            className="p-2 text-gray-400 hover:text-green-600"
                            title="Editar Estatísticas"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditPlayer(player)}
                            className="p-2 text-gray-400 hover:text-blue-600"
                            title="Editar Jogador"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                            title="Excluir Jogador"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}

                    {selectedTeam.players.length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        Nenhum jogador cadastrado. Clique em &quot;Novo Jogador&quot; para adicionar.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-center text-gray-500 py-8">
                    Selecione um time para ver os detalhes e jogadores.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Form Modal */}
      {showTeamForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTeam ? 'Editar Time' : 'Novo Time'}
              </h3>
              <TeamForm
                team={editingTeam}
                onSubmit={handleTeamSubmit}
                onCancel={() => {
                  setShowTeamForm(false);
                  setEditingTeam(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Player Form Modal */}
      {showPlayerForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPlayer ? 'Editar Jogador' : 'Novo Jogador'}
              </h3>
              <PlayerForm
                player={editingPlayer}
                onSubmit={handlePlayerSubmit}
                onCancel={() => {
                  setShowPlayerForm(false);
                  setEditingPlayer(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Player Stats Form Modal */}
      {showPlayerStatsForm && editingPlayerStats && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <PlayerStatsForm
                player={editingPlayerStats}
                onSubmit={handlePlayerStatsSubmit}
                onCancel={() => {
                  setShowPlayerStatsForm(false);
                  setEditingPlayerStats(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Exportar Dados</h3>
              <p className="text-gray-600 mb-4">
                Clique no botão abaixo para baixar todos os dados em formato JSON.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Importar Dados</h3>
              <p className="text-gray-600 mb-4">
                Cole o conteúdo JSON dos dados que deseja importar:
              </p>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="w-full h-32 p-2 border border-gray-300 rounded-md"
                placeholder="Cole o JSON aqui..."
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportData('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleImportData}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Importar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
