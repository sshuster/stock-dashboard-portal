
import { LoginCredentials, RegisterCredentials, User, Match, Bet, BettingSummary } from '@/types';
import { mockMatches, mockBets, calculateBettingSummary } from '@/lib/mockData';

const API_URL = 'http://localhost:5000/api';

// Helper to check if the backend is available
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/matches`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Backend not available, using mock data');
    return false;
  }
};

// Helper for authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const authOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, authOptions);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
};

// Auth API calls
export const loginUser = async (credentials: LoginCredentials): Promise<{ user: User, token: string }> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      // Mock login (only accept admin/admin)
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        const mockUser = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          isAdmin: true,
          balance: 1000,
        };
        const mockToken = 'mock-token-123';
        return { user: mockUser, token: mockToken };
      }
      throw new Error('Invalid username or password');
    }
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (credentials: RegisterCredentials): Promise<{ user: User, token: string }> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      // Mock registration (just simulate success)
      const mockUser = {
        id: Date.now(),
        username: credentials.username,
        email: credentials.email,
        isAdmin: false,
        balance: 500,
      };
      const mockToken = 'mock-token-' + Math.random().toString(36).substring(2);
      return { user: mockUser, token: mockToken };
    }
    
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  } catch (error) {
    throw error;
  }
};

// Matches API calls
export const getMatches = async (): Promise<Match[]> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      return mockMatches;
    }
    
    return authFetch(`${API_URL}/matches`);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return mockMatches; // Fallback to mock data
  }
};

// Bets API calls
export const getBets = async (): Promise<Bet[]> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      // Return saved admin bets if available
      const savedBets = localStorage.getItem('adminBets');
      if (savedBets) {
        try {
          return JSON.parse(savedBets) as Bet[];
        } catch (error) {
          console.error('Failed to parse saved bets:', error);
        }
      }
      return mockBets;
    }
    
    return authFetch(`${API_URL}/bets`);
  } catch (error) {
    console.error('Error fetching bets:', error);
    return mockBets; // Fallback to mock data
  }
};

export const placeBet = async (bet: Partial<Bet>): Promise<Bet> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      console.info('Backend not available, bet would be placed if it was');
      // Return a mock bet for the frontend
      return {
        id: Date.now(),
        matchId: bet.matchId!,
        teamBetOn: bet.teamBetOn!,
        odds: bet.odds!,
        amount: bet.amount!,
        potential: bet.potential!,
        status: "pending",
        dateCreated: new Date().toISOString()
      };
    }
    
    return await authFetch(`${API_URL}/bets`, {
      method: 'POST',
      body: JSON.stringify(bet)
    });
  } catch (error) {
    console.error('Error placing bet:', error);
    throw error;
  }
};

export const getBettingSummary = async (): Promise<BettingSummary> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      const bets = await getBets();
      return calculateBettingSummary(bets);
    }
    
    return authFetch(`${API_URL}/betting/summary`);
  } catch (error) {
    console.error('Error fetching betting summary:', error);
    return calculateBettingSummary(mockBets); // Fallback to mock data
  }
};

// Generate mock data (admin only)
export const generateMockData = async (): Promise<void> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      console.info('Backend not available, cannot generate mock data');
      return;
    }
    
    await fetch(`${API_URL}/mock/generate`);
  } catch (error) {
    console.error('Error generating mock data:', error);
    throw error;
  }
};
