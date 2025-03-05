
export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  companyName?: string;
  industry?: string;
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
