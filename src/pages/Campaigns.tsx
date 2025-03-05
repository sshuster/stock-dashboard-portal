
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchCampaigns } from "@/services/api";
import { Campaign } from "@/types";
import { Plus, FileEdit, Trash2 } from "lucide-react";
import CampaignGrid from "@/components/CampaignGrid";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";

const Campaigns = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadCampaigns = async () => {
      setLoading(true);
      try {
        // For admin user, add mock campaign directly in frontend
        if (user?.isAdmin) {
          const mockCampaigns: Campaign[] = [
            {
              id: 1,
              name: "Summer Product Launch",
              description: "Launch campaign for our new summer product line",
              targetAudience: "Small to medium businesses in retail sector",
              status: "active",
              startDate: "2023-06-01",
              endDate: "2023-08-31",
              budget: 5000
            },
            {
              id: 2,
              name: "B2B Newsletter Sign-up",
              description: "Campaign to increase B2B newsletter subscriptions",
              targetAudience: "Corporate decision makers",
              status: "planned",
              startDate: "2023-09-15",
              budget: 2500
            },
            {
              id: 3,
              name: "Holiday Promotion",
              description: "Special holiday promotion for existing customers",
              targetAudience: "Current customer base",
              status: "draft",
              startDate: "2023-11-01",
              endDate: "2023-12-25",
              budget: 7500
            }
          ];
          setCampaigns(mockCampaigns);
          setLoading(false);
          return;
        }

        // For regular users, fetch from API
        const campaignsData = await fetchCampaigns();
        if (campaignsData) {
          setCampaigns(campaignsData);
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [isAuthenticated, navigate, user]);

  const handleCreateCampaign = () => {
    navigate("/campaigns/new");
  };

  const handleEditCampaign = (campaignId: number) => {
    navigate(`/campaigns/${campaignId}/edit`);
  };

  const handleDeleteCampaign = (campaignId: number) => {
    // For admin user mock campaigns
    if (user?.isAdmin) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
      toast.success("Campaign deleted successfully");
      return;
    }

    // TODO: Implement actual deletion for non-admin users
    toast.error("Delete functionality not yet implemented");
  };

  return (
    <AnimatedTransition animation="fade" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-gray-500 mt-1">
              Manage your lead generation campaigns
            </p>
          </div>
          <Button 
            onClick={handleCreateCampaign} 
            className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : campaigns.length > 0 ? (
          <CampaignGrid 
            campaigns={campaigns} 
            onEdit={handleEditCampaign}
            onDelete={handleDeleteCampaign}
          />
        ) : (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">No Campaigns Yet</h2>
              <p className="text-gray-500 mb-6">
                Create your first campaign to start generating leads
              </p>
              <Button 
                onClick={handleCreateCampaign}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </AnimatedTransition>
  );
};

export default Campaigns;
