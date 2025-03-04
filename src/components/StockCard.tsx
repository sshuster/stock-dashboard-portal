
import GlassCard from "@/components/ui-custom/GlassCard";
import { Stock } from "@/types";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StockCardProps {
  stock: Stock;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const isPositive = stock.change >= 0;
  const totalValue = stock.price * stock.quantity;
  const totalCost = stock.purchasePrice * stock.quantity;
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;

  return (
    <GlassCard className="p-5 h-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{stock.symbol}</h3>
          <p className="text-sm text-gray-500">{stock.name}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">${stock.price.toFixed(2)}</div>
          <div
            className={`text-sm flex items-center justify-end ${
              isPositive ? "text-apple-green" : "text-apple-red"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs text-gray-500">Quantity</div>
          <div className="font-medium">{stock.quantity}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs text-gray-500">Avg. Cost</div>
          <div className="font-medium">${stock.purchasePrice.toFixed(2)}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs text-gray-500">Total Value</div>
          <div className="font-medium">${totalValue.toFixed(2)}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs text-gray-500">Total Gain/Loss</div>
          <div
            className={`font-medium ${
              totalGain >= 0 ? "text-apple-green" : "text-apple-red"
            }`}
          >
            ${totalGain.toFixed(2)} ({totalGainPercent.toFixed(2)}%)
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default StockCard;
