
export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
  confirmPassword: string;
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
