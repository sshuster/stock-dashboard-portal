
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import { Button } from "@/components/ui/button";
import { fetchDashboardStats, generateMockData } from "@/services/api";
import { DashboardStats as IDashboardStats } from "@/types";
import { PlusCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const statsData = await fetchDashboardStats();
        if (statsData) {
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated, navigate]);

  const handleGenerateMockData = async () => {
    const confirmed = window.confirm(
      "This will generate sample campaign and lead data for testing. Continue?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const success = await generateMockData();
      if (success) {
        toast.success("Mock data generated successfully");
        // Reload stats
        const statsData = await fetchDashboardStats();
        if (statsData) {
          setStats(statsData);
        }
      } else {
        toast.error("Failed to generate mock data");
      }
    } catch (error) {
      console.error("Error generating mock data:", error);
      toast.error("Failed to generate mock data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedTransition animation="fade" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back{user?.username ? `, ${user.username}` : ""}
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            {user?.isAdmin && (
              <Button
                variant="outline"
                onClick={handleGenerateMockData}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Generate Test Data
              </Button>
            )}
            <Button
              onClick={() => navigate("/campaigns/new")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : stats ? (
          <DashboardStats stats={stats} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-gray-500 mb-6">
              Start creating campaigns to generate leads and see your dashboard come to life.
            </p>
            <Button
              onClick={() => navigate("/campaigns/new")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Campaign
            </Button>
          </div>
        )}
      </main>
    </AnimatedTransition>
  );
};

export default Dashboard;
