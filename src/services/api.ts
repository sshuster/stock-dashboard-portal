
import { Campaign, CampaignDetails, DashboardStats, Lead } from "@/types";

const API_URL = "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Campaign API calls
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await fetch(`${API_URL}/campaigns`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch campaigns");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
};

export const fetchCampaignDetails = async (id: number): Promise<CampaignDetails | null> => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch campaign details");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching campaign details for ID ${id}:`, error);
    return null;
  }
};

export const createCampaign = async (campaign: Omit<Campaign, "id">): Promise<Campaign | null> => {
  try {
    const response = await fetch(`${API_URL}/campaigns`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(campaign),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create campaign");
    }
    
    const data = await response.json();
    return data.campaign;
  } catch (error) {
    console.error("Error creating campaign:", error);
    return null;
  }
};

// Lead API calls
export const addLead = async (
  campaignId: number,
  lead: Omit<Lead, "id" | "dateCreated">
): Promise<Lead | null> => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}/leads`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(lead),
    });
    
    if (!response.ok) {
      throw new Error("Failed to add lead");
    }
    
    const data = await response.json();
    return data.lead;
  } catch (error) {
    console.error("Error adding lead:", error);
    return null;
  }
};

export const updateLead = async (
  campaignId: number,
  leadId: number,
  lead: Partial<Lead>
): Promise<Lead | null> => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}/leads/${leadId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(lead),
    });
    
    if (!response.ok) {
      throw new Error("Failed to update lead");
    }
    
    const data = await response.json();
    return data.lead;
  } catch (error) {
    console.error(`Error updating lead ID ${leadId}:`, error);
    return null;
  }
};

// Dashboard statistics
export const fetchDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    const response = await fetch(`${API_URL}/dashboardStats`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard statistics");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return null;
  }
};

// Mock data generator
export const generateMockData = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/mock/generate`);
    return response.ok;
  } catch (error) {
    console.error("Error generating mock data:", error);
    return false;
  }
};
