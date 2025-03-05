
import { DashboardStats as IDashboardStats, Lead } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Badge } from "./ui/badge";
import { Briefcase, Target, Users, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DashboardStatsProps {
  stats: IDashboardStats;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b'];

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  // Prepare data for the pie chart
  const statusData = Object.entries(stats.leadsByStatus).map(([key, value], index) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Total Campaigns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeCampaigns} active campaigns
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Total Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLeads}</div>
          <p className="text-xs text-muted-foreground">
            Across all campaigns
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Lead Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.leadsByStatus?.converted
              ? `${Math.round((stats.leadsByStatus.converted / stats.totalLeads) * 100)}%`
              : "0%"}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.leadsByStatus?.converted || 0} converted leads
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Lead Quality */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lead Quality</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.leadsByStatus?.qualified
              ? `${Math.round((stats.leadsByStatus.qualified / stats.totalLeads) * 100)}%`
              : "0%"}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.leadsByStatus?.qualified || 0} qualified leads
          </p>
        </CardContent>
      </Card>

      {/* Lead Status Breakdown Chart */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Lead Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No lead data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Leads */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentLeads.length > 0 ? (
            <div className="space-y-4">
              {stats.recentLeads.map((lead: Lead) => (
                <div key={lead.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">
                      {lead.firstName && lead.lastName 
                        ? `${lead.firstName} ${lead.lastName}` 
                        : (lead.firstName || lead.lastName || lead.email)}
                    </div>
                    <div className="text-sm text-muted-foreground">{lead.email}</div>
                    {lead.campaignName && (
                      <div className="text-xs text-muted-foreground">
                        From: {lead.campaignName}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-right text-muted-foreground">
                      {formatDate(lead.dateCreated)}
                    </div>
                    <Badge className="capitalize" variant="outline">
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center">
              <p className="text-muted-foreground">No recent leads</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
