
import GlassCard from "@/components/ui-custom/GlassCard";
import { PortfolioSummary } from "@/types";
import { ArrowDown, ArrowUp, Briefcase, LineChart, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  summary: PortfolioSummary;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ summary }) => {
  const isPositive = summary.totalGain >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Portfolio Value</p>
            <h3 className="text-2xl font-bold mt-1">
              ${summary.totalValue.toFixed(2)}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-apple-blue" />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Gain/Loss</p>
            <h3 className={`text-2xl font-bold mt-1 ${isPositive ? "text-apple-green" : "text-apple-red"}`}>
              ${summary.totalGain.toFixed(2)}
            </h3>
          </div>
          <div className={`h-12 w-12 rounded-full ${isPositive ? "bg-green-100" : "bg-red-100"} flex items-center justify-center`}>
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-apple-green" />
            ) : (
              <TrendingUp className="h-6 w-6 text-apple-red" />
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">% Change</p>
            <h3 className={`text-2xl font-bold mt-1 flex items-center ${isPositive ? "text-apple-green" : "text-apple-red"}`}>
              {isPositive ? (
                <ArrowUp className="h-5 w-5 mr-1" />
              ) : (
                <ArrowDown className="h-5 w-5 mr-1" />
              )}
              {Math.abs(summary.totalGainPercent).toFixed(2)}%
            </h3>
          </div>
          <div className={`h-12 w-12 rounded-full ${isPositive ? "bg-green-100" : "bg-red-100"} flex items-center justify-center`}>
            <LineChart className={`h-6 w-6 ${isPositive ? "text-apple-green" : "text-apple-red"}`} />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Stocks</p>
            <h3 className="text-2xl font-bold mt-1">
              {summary.totalStocks}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-apple-blue" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardStats;
