
export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  balance?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
  confirmPassword: string;
}

export interface Bet {
  id: number;
  matchId: number;
  teamBetOn: string;
  odds: number;
  amount: number;
  potential: number;
  status: "pending" | "won" | "lost";
  dateCreated: string;
}

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  sport: "football" | "basketball" | "baseball" | "hockey" | "soccer";
  league: string;
  startTime: string;
  homeOdds: number;
  awayOdds: number;
  drawOdds?: number;
  status: "scheduled" | "live" | "completed";
  homeScore?: number;
  awayScore?: number;
}

export interface MatchWithBets extends Match {
  userBets?: Bet[];
}

export interface BettingSummary {
  totalBets: number;
  pendingBets: number;
  totalWagered: number;
  totalWon: number;
  netProfit: number;
  winRate: number;
}
