
import { StockWithHistory } from "@/types";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StockChartProps {
  stock: StockWithHistory;
  height?: number;
}

const StockChart: React.FC<StockChartProps> = ({ stock, height = 300 }) => {
  const isPositive = stock.change >= 0;
  const chartColor = isPositive ? "#34c759" : "#ff3b30";

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{stock.symbol} Price History</h3>
        <p className="text-sm text-gray-500">{stock.name}</p>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={stock.history}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            interval={4}
          />
          <YAxis 
            domain={["dataMin - 5", "dataMax + 5"]} 
            tick={{ fontSize: 12 }} 
            tickFormatter={(value) => `$${value}`}
            width={60}
          />
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <Tooltip 
            contentStyle={{ 
              background: "rgba(255, 255, 255, 0.95)", 
              border: "none", 
              borderRadius: "8px", 
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" 
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={chartColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradient-${stock.symbol})`}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
