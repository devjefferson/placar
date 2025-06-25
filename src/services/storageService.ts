import { AppData, Team, Player, Match, AdminAuth } from '@/types';

const STORAGE_KEY = 'placar_data';
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limite aproximado

export class StorageService {
  private static getData(): AppData {
    if (typeof window === 'undefined') {
      return {
        teams: [],
        matches: [],
        adminAuth: { isAuthenticated: false, password: '' }
      };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        teams: [],
        matches: [],
        adminAuth: { isAuthenticated: false, password: '' }
      };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return {
        teams: [],
        matches: [],
        adminAuth: { isAuthenticated: false, password: '' }
      };
    }
  }

  private static saveData(data: AppData): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const jsonData = JSON.stringify(data);
      
      // Verificar se os dados excedem o limite
      if (jsonData.length > MAX_STORAGE_SIZE) {
        // Tentar limpar dados antigos
        this.cleanupOldData(data);
        const cleanedData = JSON.stringify(data);
        
        if (cleanedData.length > MAX_STORAGE_SIZE) {
          throw new Error('Dados muito grandes para o LocalStorage. Considere remover alguns times ou usar imagens menores.');
        }
      }
      
      localStorage.setItem(STORAGE_KEY, jsonData);
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar dados: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      return false;
    }
  }

  private static cleanupOldData(data: AppData): void {
    // Remover dados de partidas antigas se houver muitos times
    if (data.teams.length > 10) {
      data.matches = data.matches.slice(-50); // Manter apenas as 50 partidas mais recentes
    }
    
    // Comprimir imagens se necessário
    data.teams.forEach(team => {
      if (team.shield && team.shield.length > 50000) { // Se a imagem for maior que ~50KB
        // Reduzir qualidade da imagem
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);
            team.shield = canvas.toDataURL('image/jpeg', 0.5);
          }
        };
        img.src = team.shield;
      }
    });
  }

  // Teams
  static getTeams(): Team[] {
    return this.getData().teams;
  }

  static saveTeam(team: Team): boolean {
    const data = this.getData();
    const existingIndex = data.teams.findIndex(t => t.id === team.id);
    
    if (existingIndex >= 0) {
      data.teams[existingIndex] = team;
    } else {
      data.teams.push(team);
    }
    
    return this.saveData(data);
  }

  static deleteTeam(teamId: string): boolean {
    const data = this.getData();
    data.teams = data.teams.filter(t => t.id !== teamId);
    data.matches = data.matches.filter(m => 
      m.homeTeamId !== teamId && m.awayTeamId !== teamId
    );
    return this.saveData(data);
  }

  // Players
  static addPlayer(teamId: string, player: Player): boolean {
    const data = this.getData();
    const team = data.teams.find(t => t.id === teamId);
    if (team) {
      team.players.push(player);
      return this.saveData(data);
    }
    return false;
  }

  static updatePlayer(teamId: string, player: Player): boolean {
    const data = this.getData();
    const team = data.teams.find(t => t.id === teamId);
    if (team) {
      const playerIndex = team.players.findIndex(p => p.id === player.id);
      if (playerIndex >= 0) {
        team.players[playerIndex] = player;
        return this.saveData(data);
      }
    }
    return false;
  }

  static deletePlayer(teamId: string, playerId: string): boolean {
    const data = this.getData();
    const team = data.teams.find(t => t.id === teamId);
    if (team) {
      team.players = team.players.filter(p => p.id !== playerId);
      return this.saveData(data);
    }
    return false;
  }

  // Matches
  static getMatches(): Match[] {
    return this.getData().matches;
  }

  static saveMatch(match: Match): boolean {
    const data = this.getData();
    const existingIndex = data.matches.findIndex(m => m.id === match.id);
    
    if (existingIndex >= 0) {
      data.matches[existingIndex] = match;
    } else {
      data.matches.push(match);
    }
    
    return this.saveData(data);
  }

  // Admin Auth
  static getAdminAuth(): AdminAuth {
    return this.getData().adminAuth;
  }

  static setAdminAuth(auth: AdminAuth): boolean {
    const data = this.getData();
    data.adminAuth = auth;
    return this.saveData(data);
  }

  // Export/Import
  static exportData(): string {
    return JSON.stringify(this.getData(), null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      return this.saveData(data);
    } catch {
      return false;
    }
  }

  // Reset
  static resetAllData(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Erro ao resetar dados:', error);
      return false;
    }
  }

  // Verificar espaço disponível
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    if (typeof window === 'undefined') {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      const data = this.getData();
      const jsonData = JSON.stringify(data);
      const used = jsonData.length;
      const available = MAX_STORAGE_SIZE;
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
} 