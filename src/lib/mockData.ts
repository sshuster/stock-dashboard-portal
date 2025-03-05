
import { Bet, BettingSummary, Match, MatchWithBets, User } from "@/types";

// Mock user data
export const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    password: "admin",
    isAdmin: true,
    balance: 1000,
  },
];

// Generate date for upcoming matches
function getUpcomingDate(daysFromNow: number, hoursFromNow = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(date.getHours() + hoursFromNow);
  return date.toISOString();
}

// Mock matches data
export const mockMatches: MatchWithBets[] = [
  {
    id: 1,
    homeTeam: "New York Jets",
    awayTeam: "Buffalo Bills",
    sport: "football",
    league: "NFL",
    startTime: getUpcomingDate(1, 4),
    homeOdds: 2.5,
    awayOdds: 1.65,
    status: "scheduled",
  },
  {
    id: 2,
    homeTeam: "Los Angeles Lakers",
    awayTeam: "Golden State Warriors",
    sport: "basketball",
    league: "NBA",
    startTime: getUpcomingDate(0, 3),
    homeOdds: 1.9,
    awayOdds: 2.1,
    status: "scheduled",
  },
  {
    id: 3,
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    sport: "soccer",
    league: "Premier League",
    startTime: getUpcomingDate(2),
    homeOdds: 3.1,
    awayOdds: 2.4,
    drawOdds: 3.3,
    status: "scheduled",
  },
  {
    id: 4,
    homeTeam: "New York Yankees",
    awayTeam: "Boston Red Sox",
    sport: "baseball",
    league: "MLB",
    startTime: getUpcomingDate(1, 6),
    homeOdds: 1.75,
    awayOdds: 2.25,
    status: "scheduled",
  },
  {
    id: 5,
    homeTeam: "Tampa Bay Lightning",
    awayTeam: "Florida Panthers",
    sport: "hockey",
    league: "NHL",
    startTime: getUpcomingDate(3, 2),
    homeOdds: 2.15,
    awayOdds: 1.85,
    status: "scheduled",
  },
];

// Mock bets data
export const mockBets: Bet[] = [
  {
    id: 1,
    matchId: 2,
    teamBetOn: "Los Angeles Lakers",
    odds: 1.9,
    amount: 50,
    potential: 95,
    status: "pending",
    dateCreated: new Date().toISOString(),
  },
  {
    id: 2,
    matchId: 3,
    teamBetOn: "Liverpool",
    odds: 2.4,
    amount: 100,
    potential: 240,
    status: "pending",
    dateCreated: new Date().toISOString(),
  },
  {
    id: 3,
    matchId: 1,
    teamBetOn: "Buffalo Bills",
    odds: 1.65,
    amount: 75,
    potential: 123.75,
    status: "won",
    dateCreated: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];

// Calculate betting summary
export function calculateBettingSummary(bets: Bet[]): BettingSummary {
  const totalBets = bets.length;
  const pendingBets = bets.filter(bet => bet.status === "pending").length;
  const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const wonBets = bets.filter(bet => bet.status === "won");
  const totalWon = wonBets.reduce((sum, bet) => sum + bet.potential, 0);
  const netProfit = totalWon - totalWagered;
  const completedBets = bets.filter(bet => bet.status !== "pending").length;
  const winRate = completedBets > 0 ? (wonBets.length / completedBets) * 100 : 0;
  
  return {
    totalBets,
    pendingBets,
    totalWagered,
    totalWon,
    netProfit,
    winRate,
  };
}

// Available sports leagues for filters
export const availableSports = [
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "baseball", label: "Baseball" },
  { value: "hockey", label: "Hockey" },
  { value: "soccer", label: "Soccer" },
];

export const availableLeagues = [
  { value: "NFL", label: "NFL" },
  { value: "NBA", label: "NBA" },
  { value: "MLB", label: "MLB" },
  { value: "NHL", label: "NHL" },
  { value: "Premier League", label: "Premier League" },
  { value: "La Liga", label: "La Liga" },
  { value: "Bundesliga", label: "Bundesliga" },
  { value: "Serie A", label: "Serie A" },
];

// Mock betting summary for API fallback
export const mockBettingSummary: BettingSummary = calculateBettingSummary(mockBets);
