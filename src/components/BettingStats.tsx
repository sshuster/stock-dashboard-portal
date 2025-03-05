
import GlassCard from "@/components/ui-custom/GlassCard";
import { BettingSummary } from "@/types";
import { BarChart3, DollarSign, Percent, Timer } from "lucide-react";

interface BettingStatsProps {
  summary: BettingSummary;
}

const BettingStats: React.FC<BettingStatsProps> = ({ summary }) => {
  const isProfit = summary.netProfit >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Wagered</p>
            <h3 className="text-2xl font-bold mt-1">
              ${summary.totalWagered.toFixed(2)}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Net Profit/Loss</p>
            <h3 className={`text-2xl font-bold mt-1 ${isProfit ? "text-green-600" : "text-red-500"}`}>
              {isProfit ? "+" : ""}{summary.netProfit.toFixed(2)}
            </h3>
          </div>
          <div className={`h-12 w-12 rounded-full ${isProfit ? "bg-green-100" : "bg-red-100"} flex items-center justify-center`}>
            <BarChart3 className={`h-6 w-6 ${isProfit ? "text-green-600" : "text-red-500"}`} />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Win Rate</p>
            <h3 className="text-2xl font-bold mt-1">
              {summary.winRate.toFixed(1)}%
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Percent className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Bets</p>
            <h3 className="text-2xl font-bold mt-1">
              {summary.pendingBets}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
            <Timer className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default BettingStats;
