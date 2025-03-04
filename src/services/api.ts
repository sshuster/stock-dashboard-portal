
import { LoginCredentials, RegisterCredentials, Stock, StockHistory, PortfolioSummary, User } from '@/types';
import { mockPortfolioSummary, mockStocks, mockStockHistory } from '@/lib/mockData';

const API_URL = 'http://localhost:5000/api';

// Helper to check if the backend is available
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/stocks`, { method: 'HEAD' });
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
          isAdmin: true
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
        isAdmin: false
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

// Stock API calls
export const getStocks = async (): Promise<Stock[]> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      return mockStocks;
    }
    
    return authFetch(`${API_URL}/stocks`);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return mockStocks; // Fallback to mock data
  }
};

export const addStock = async (stock: Partial<Stock>): Promise<void> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      console.info('Backend not available, stock would be added if it was');
      return;
    }
    
    await authFetch(`${API_URL}/stocks`, {
      method: 'POST',
      body: JSON.stringify(stock)
    });
  } catch (error) {
    console.error('Error adding stock:', error);
    throw error;
  }
};

export const deleteStock = async (stockId: number): Promise<void> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      console.info('Backend not available, stock would be deleted if it was');
      return;
    }
    
    await authFetch(`${API_URL}/stocks/${stockId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting stock:', error);
    throw error;
  }
};

export const getStockHistory = async (symbol: string): Promise<StockHistory[]> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      return mockStockHistory;
    }
    
    return authFetch(`${API_URL}/stocks/${symbol}/history`);
  } catch (error) {
    console.error('Error fetching stock history:', error);
    return mockStockHistory; // Fallback to mock data
  }
};

export const getPortfolioSummary = async (): Promise<PortfolioSummary> => {
  try {
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      return mockPortfolioSummary;
    }
    
    return authFetch(`${API_URL}/portfolio/summary`);
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    return mockPortfolioSummary; // Fallback to mock data
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
