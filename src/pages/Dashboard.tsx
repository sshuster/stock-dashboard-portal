
import AddStockForm from "@/components/AddStockForm";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import DashboardStats from "@/components/DashboardStats";
import GlassCard from "@/components/ui-custom/GlassCard";
import Header from "@/components/Header";
import StockChart from "@/components/StockChart";
import StockGrid from "@/components/StockGrid";
import { useAuth } from "@/context/AuthContext";
import { calculatePortfolioSummary, mockStocks } from "@/lib/mockData";
import { Stock, StockWithHistory } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<StockWithHistory[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockWithHistory | null>(null);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      // Load user stocks (using mock data for admin)
      if (user?.username === "admin") {
        setStocks(mockStocks);
        setNextId(mockStocks.length + 1);
      } else {
        // For non-admin users, we would fetch from backend
        // But for now, just initialize with empty array
        setStocks([]);
        setNextId(1);
      }
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (stocks.length > 0 && !selectedStock) {
      setSelectedStock(stocks[0]);
    }
  }, [stocks, selectedStock]);

  const handleAddStock = (symbol: string, quantity: number, purchasePrice: number) => {
    // In a real app, this would be an API call to add the stock
    const selectedAvailableStock = mockStocks.find(s => s.symbol === symbol);
    
    if (!selectedAvailableStock) {
      toast.error("Stock not found");
      return;
    }
    
    // Check if stock already exists in portfolio
    const existingStock = stocks.find(s => s.symbol === symbol);
    
    if (existingStock) {
      // Update existing stock quantity
      const updatedStocks = stocks.map(stock => 
        stock.symbol === symbol 
          ? { 
              ...stock, 
              quantity: stock.quantity + quantity,
              // Recalculate average purchase price
              purchasePrice: ((stock.purchasePrice * stock.quantity) + (purchasePrice * quantity)) / (stock.quantity + quantity)
            } 
          : stock
      );
      
      setStocks(updatedStocks);
      toast.success(`Added ${quantity} more shares of ${symbol}`);
    } else {
      // Add new stock
      const newStock: StockWithHistory = {
        id: nextId,
        symbol,
        name: selectedAvailableStock.name,
        price: selectedAvailableStock.price,
        change: selectedAvailableStock.change,
        changePercent: selectedAvailableStock.changePercent,
        quantity,
        purchasePrice,
        history: selectedAvailableStock.history
      };
      
      setStocks([...stocks, newStock]);
      setNextId(nextId + 1);
      toast.success(`Added ${symbol} to portfolio`);
    }
  };

  const handleRemoveStock = (stockId: number) => {
    const stockToRemove = stocks.find(stock => stock.id === stockId);
    
    if (!stockToRemove) return;
    
    // Remove the stock
    const updatedStocks = stocks.filter(stock => stock.id !== stockId);
    setStocks(updatedStocks);
    
    // If the selected stock is removed, select another one
    if (selectedStock && selectedStock.id === stockId) {
      setSelectedStock(updatedStocks.length > 0 ? updatedStocks[0] : null);
    }
    
    toast.success(`Removed ${stockToRemove.symbol} from portfolio`);
  };

  const summary = calculatePortfolioSummary(stocks);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedTransition animation="fade" className="mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
            <AddStockForm onAddStock={handleAddStock} />
          </div>
        </AnimatedTransition>

        <AnimatedTransition animation="fade" delay={100} className="mb-8">
          <DashboardStats summary={summary} />
        </AnimatedTransition>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AnimatedTransition animation="fade" delay={200}>
              <GlassCard className="p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Portfolio Holdings</h2>
                <StockGrid stocks={stocks} onRemoveStock={handleRemoveStock} />
              </GlassCard>
            </AnimatedTransition>
          </div>

          <div>
            <AnimatedTransition animation="fade" delay={300}>
              <GlassCard className="p-6 h-full">
                {selectedStock ? (
                  <StockChart stock={selectedStock} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">
                      No stocks in portfolio. Add stocks to see their performance.
                    </p>
                  </div>
                )}
              </GlassCard>
            </AnimatedTransition>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
