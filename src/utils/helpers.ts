import { Team, Player, Match } from '@/types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const calculateTeamStats = (team: Team, matches: Match[]): Team => {
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  matches.forEach(match => {
    if (match.homeTeamId === team.id) {
      goalsFor += match.homeScore;
      goalsAgainst += match.awayScore;
      
      if (match.homeScore > match.awayScore) wins++;
      else if (match.homeScore === match.awayScore) draws++;
      else losses++;
    } else if (match.awayTeamId === team.id) {
      goalsFor += match.awayScore;
      goalsAgainst += match.homeScore;
      
      if (match.awayScore > match.homeScore) wins++;
      else if (match.awayScore === match.homeScore) draws++;
      else losses++;
    }
  });

  return {
    ...team,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst
  };
};

export const calculateTeamPoints = (team: Team): number => {
  return team.wins * 3 + team.draws;
};

export const calculateGoalDifference = (team: Team): number => {
  return team.goalsFor - team.goalsAgainst;
};

export const sortTeamsByRanking = (teams: Team[], matches: Match[]): Team[] => {
  const teamsWithStats = teams.map(team => calculateTeamStats(team, matches));
  
  return teamsWithStats.sort((a, b) => {
    const pointsA = calculateTeamPoints(a);
    const pointsB = calculateTeamPoints(b);
    
    if (pointsA !== pointsB) return pointsB - pointsA;
    
    const goalDiffA = calculateGoalDifference(a);
    const goalDiffB = calculateGoalDifference(b);
    
    if (goalDiffA !== goalDiffB) return goalDiffB - goalDiffA;
    
    if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor;
    
    return a.name.localeCompare(b.name);
  });
};

export const getTopScorer = (teams: Team[]): Player | null => {
  const allPlayers = teams.flatMap(team => team.players);
  if (allPlayers.length === 0) return null;
  
  return allPlayers.reduce((top, player) => 
    player.goals > top.goals ? player : top
  );
};

export const getMostCardsPlayer = (teams: Team[]): Player | null => {
  const allPlayers = teams.flatMap(team => team.players);
  if (allPlayers.length === 0) return null;
  
  return allPlayers.reduce((top, player) => {
    const totalCards = player.yellowCards + player.redCards;
    const topTotalCards = top.yellowCards + top.redCards;
    return totalCards > topTotalCards ? player : top;
  });
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file: File, maxWidth: number = 200, maxHeight: number = 200, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular novas dimensões mantendo proporção
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } else {
        reject(new Error('Não foi possível criar contexto do canvas'));
      }
    };

    img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    img.src = URL.createObjectURL(file);
  });
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const getTeamById = (teams: Team[], teamId: string): Team | undefined => {
  return teams.find(team => team.id === teamId);
}; 