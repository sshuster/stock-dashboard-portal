
import { Campaign } from "@/types";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { PlusCircle, Edit, Eye } from "lucide-react";
import AnimatedTransition from "./ui-custom/AnimatedTransition";
import { formatDistanceToNow } from "date-fns";

interface CampaignGridProps {
  campaigns: Campaign[];
  onCreateNew: () => void;
}

const CampaignGrid: React.FC<CampaignGridProps> = ({ campaigns, onCreateNew }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "draft":
        return "bg-gray-500";
      case "planned":
        return "bg-blue-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <AnimatedTransition animation="fade" className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Campaigns</h2>
        <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="w-full p-8 text-center">
          <CardContent className="pt-6">
            <p className="text-gray-500 mb-4">You don't have any campaigns yet.</p>
            <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge className={`${getStatusColor(campaign.status)} text-white capitalize`}>
                    {campaign.status}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    Started {formatDate(campaign.startDate)}
                  </div>
                </div>
                <CardTitle className="text-xl mt-2">{campaign.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {campaign.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {campaign.targetAudience && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-500">Target Audience:</span>
                    <p className="text-sm line-clamp-1">{campaign.targetAudience}</p>
                  </div>
                )}
                {campaign.budget && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-500">Budget:</span>
                    <p className="text-sm">${campaign.budget.toLocaleString()}</p>
                  </div>
                )}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AnimatedTransition>
  );
};

export default CampaignGrid;
