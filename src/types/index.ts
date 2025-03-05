export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  companyName?: string;
  industry?: string;
  balance?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
  confirmPassword: string;
  companyName?: string;
  industry?: string;
}

export interface Lead {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
  status: "new" | "contacted" | "qualified" | "converted" | "unqualified";
  notes?: string;
  dateCreated: string;
  campaignName?: string;
}

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  targetAudience?: string;
  status: "draft" | "planned" | "active" | "paused" | "completed";
  startDate: string;
  endDate?: string;
  budget?: number;
}

export interface CampaignDetails extends Campaign {
  leads?: Lead[];
}

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalLeads: number;
  leadsByStatus: Record<string, number>;
  recentLeads: Lead[];
}

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  league: string;
  startTime: string;
  homeOdds: number;
  awayOdds: number;
  drawOdds?: number;
  status: "scheduled" | "live" | "finished" | "cancelled";
}

export interface MatchWithBets extends Match {
  bets?: Bet[];
}

export interface Bet {
  id: number;
  matchId: number;
  teamBetOn: string;
  odds: number;
  amount: number;
  potential: number;
  status: "pending" | "won" | "lost" | "cancelled";
  dateCreated: string;
}

export interface BettingSummary {
  totalBets: number;
  pendingBets: number;
  totalWagered: number;
  totalWon: number;
  netProfit: number;
  winRate: number;
}

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
