
import { mockUsers } from "@/lib/mockData";
import { LoginCredentials, RegisterCredentials, User } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // In a real app, this would be an API call
    // For now, we'll use our mock data
    const { username, password } = credentials;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication logic
    const foundUser = mockUsers.find(u => 
      u.username === username && u.password === password
    );
    
    if (foundUser) {
      const userInfo: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin
      };
      
      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userInfo));
      
      toast.success(`Welcome back, ${userInfo.username}!`);
      return true;
    } else {
      toast.error("Invalid username or password");
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would create a new user
    // For now, we'll just simulate and only allow registering non-existing usernames
    const { username, email, password, confirmPassword } = credentials;
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    
    const userExists = mockUsers.some(u => u.username === username);
    
    if (userExists) {
      toast.error("Username already exists");
      return false;
    }
    
    // In a real app, we would create the user in the database
    // For demo purposes, we'll just log in directly
    const userInfo: User = {
      id: mockUsers.length + 1,
      username,
      email,
      isAdmin: false
    };
    
    setUser(userInfo);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userInfo));
    
    toast.success("Registration successful!");
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    navigate("/login");
    toast.info("Successfully logged out");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
