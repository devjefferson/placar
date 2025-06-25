export interface Player {
  id: string;
  name: string;
  number: number;
  goals: number;
  yellowCards: number;
  redCards: number;
}

export interface Team {
  id: string;
  name: string;
  shield: string; // Base64 da imagem
  players: Player[];
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: string;
  events: MatchEvent[];
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellowCard' | 'redCard';
  playerId: string;
  teamId: string;
  minute: number;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  password: string;
}

export interface AppData {
  teams: Team[];
  matches: Match[];
  adminAuth: AdminAuth;
} 