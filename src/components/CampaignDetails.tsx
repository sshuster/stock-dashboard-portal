
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/types';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};

// Status badge colors
const getStatusColor = (status: Campaign['status']) => {
  switch(status) {
    case 'active': return 'bg-green-500 hover:bg-green-600';
    case 'draft': return 'bg-gray-500 hover:bg-gray-600';
    case 'planned': return 'bg-blue-500 hover:bg-blue-600';
    case 'paused': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'completed': return 'bg-purple-500 hover:bg-purple-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

interface CampaignDetailsProps {
  campaign: Campaign;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign }) => {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{campaign.name}</CardTitle>
            <CardDescription className="mt-1">
              {campaign.description || 'No description provided'}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {campaign.targetAudience && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Target Audience</h4>
              <p className="text-sm">{campaign.targetAudience}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Timeline</h4>
            <p className="text-sm">
              {formatDate(campaign.startDate)}
              {campaign.endDate ? ` to ${formatDate(campaign.endDate)}` : ' (ongoing)'}
            </p>
          </div>
          {campaign.budget && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Budget</h4>
              <p className="text-sm font-semibold">{formatCurrency(campaign.budget)}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="text-sm text-gray-500">
          Campaign ID: {campaign.id}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampaignDetails;
