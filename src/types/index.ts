
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

// We need to remove all the outdated components,
// but since they rely on these types, let's add them here temporarily
// just to make TypeScript happy.
export interface Stock {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  quantity: number;
  purchasePrice: number;
}

export interface StockHistory {
  date: string;
  price: number;
}

export interface StockWithHistory extends Stock {
  history: StockHistory[];
}

export interface PortfolioSummary {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  totalStocks: number;
}
