
import React from 'react';
import { Campaign } from '@/types';
import CampaignDetails from './CampaignDetails';
import { Button } from './ui/button';
import { FileEdit, Trash2 } from 'lucide-react';

interface CampaignGridProps {
  campaigns: Campaign[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CampaignGrid: React.FC<CampaignGridProps> = ({ campaigns, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="relative group">
          <CampaignDetails campaign={campaign} />
          <div className="absolute top-3 right-3 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white shadow-sm"
              onClick={() => onEdit(campaign.id)}
            >
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white shadow-sm text-red-500 hover:text-red-600"
              onClick={() => onDelete(campaign.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignGrid;
