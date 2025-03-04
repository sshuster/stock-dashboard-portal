
import { PortfolioSummary, Stock, StockWithHistory, User } from "@/types";

// Mock user data
export const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    password: "admin",
    isAdmin: true,
  },
];

// Mock stock data
export const mockStocks: StockWithHistory[] = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 172.50,
    change: 2.35,
    changePercent: 1.38,
    quantity: 10,
    purchasePrice: 150.25,
    history: generateRandomHistory(30, 150, 180),
  },
  {
    id: 2,
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 328.79,
    change: -1.21,
    changePercent: -0.37,
    quantity: 5,
    purchasePrice: 290.50,
    history: generateRandomHistory(30, 290, 330),
  },
  {
    id: 3,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 134.99,
    change: 0.87,
    changePercent: 0.65,
    quantity: 8,
    purchasePrice: 125.30,
    history: generateRandomHistory(30, 120, 140),
  },
  {
    id: 4,
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 143.56,
    change: 1.05,
    changePercent: 0.74,
    quantity: 12,
    purchasePrice: 130.45,
    history: generateRandomHistory(30, 125, 145),
  },
  {
    id: 5,
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 177.80,
    change: -5.20,
    changePercent: -2.84,
    quantity: 15,
    purchasePrice: 200.10,
    history: generateRandomHistory(30, 170, 210),
  },
];

// Generate random history data
function generateRandomHistory(days: number, min: number, max: number): { date: string; price: number }[] {
  const history = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat((min + Math.random() * (max - min)).toFixed(2)),
    });
  }
  
  return history;
}

// Calculate portfolio summary
export function calculatePortfolioSummary(stocks: Stock[]): PortfolioSummary {
  const totalValue = stocks.reduce((sum, stock) => sum + stock.price * stock.quantity, 0);
  const totalCost = stocks.reduce((sum, stock) => sum + stock.purchasePrice * stock.quantity, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  
  return {
    totalValue,
    totalGain,
    totalGainPercent,
    totalStocks: stocks.length,
  };
}

// Available stock symbols for adding to portfolio
export const availableStocks = [
  { symbol: "NFLX", name: "Netflix, Inc." },
  { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "DIS", name: "The Walt Disney Company" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "KO", name: "The Coca-Cola Company" },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "CRM", name: "Salesforce, Inc." },
];

// Add the missing exports that are needed by the api.ts file
export const mockPortfolioSummary: PortfolioSummary = calculatePortfolioSummary(mockStocks);

// Export mock stock history for API fallback
export const mockStockHistory = mockStocks[0].history;
