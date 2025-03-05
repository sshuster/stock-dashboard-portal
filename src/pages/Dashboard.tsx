
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import BetHistory from "@/components/BetHistory";
import BettingStats from "@/components/BettingStats";
import GlassCard from "@/components/ui-custom/GlassCard";
import Header from "@/components/Header";
import MatchGrid from "@/components/MatchGrid";
import { useAuth } from "@/context/AuthContext";
import { calculateBettingSummary, mockBets, mockMatches } from "@/lib/mockData";
import { Bet, MatchWithBets } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, user, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchWithBets[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      // Load user matches and bets
      if (user?.username === "admin") {
        const savedBets = localStorage.getItem('adminBets');
        if (savedBets) {
          try {
            const parsedBets = JSON.parse(savedBets) as Bet[];
            setBets(parsedBets);
            setNextId(Math.max(...parsedBets.map(b => b.id), 0) + 1);
          } catch (error) {
            console.error('Failed to parse saved bets:', error);
            // Fallback to mock data
            setBets(mockBets);
            setNextId(mockBets.length + 1);
          }
        } else {
          // No saved bets, use mock data
          setBets(mockBets);
          setNextId(mockBets.length + 1);
        }
        
        // Always use mock matches for demo
        setMatches(mockMatches);
      } else {
        // For non-admin users, use empty state or connect to backend
        setBets([]);
        setMatches(mockMatches);
        setNextId(1);
      }
    }
  }, [isAuthenticated, navigate, user]);

  // Save admin bets to localStorage whenever they change
  useEffect(() => {
    if (user?.username === "admin" && bets.length > 0) {
      localStorage.setItem('adminBets', JSON.stringify(bets));
    }
  }, [bets, user]);

  const handlePlaceBet = (matchId: number, team: string, odds: number, amount: number) => {
    const match = matches.find(m => m.id === matchId);
    
    if (!match) {
      toast.error("Match not found");
      return;
    }
    
    // Calculate potential winnings
    const potential = amount * odds;
    
    // Create new bet
    const newBet: Bet = {
      id: nextId,
      matchId,
      teamBetOn: team,
      odds,
      amount,
      potential,
      status: "pending",
      dateCreated: new Date().toISOString()
    };
    
    // Add bet to state
    setBets([...bets, newBet]);
    setNextId(nextId + 1);
    
    toast.success(`Bet placed on ${team}`);
  };

  const summary = calculateBettingSummary(bets);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedTransition animation="fade" className="mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Sports Betting Dashboard</h1>
              {user && (
                <div className="flex items-center mt-2 text-lg font-medium text-gray-700">
                  <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                  Balance: ${user.balance?.toFixed(2) || "0.00"}
                </div>
              )}
            </div>
          </div>
        </AnimatedTransition>

        <AnimatedTransition animation="fade" delay={100} className="mb-8">
          <BettingStats summary={summary} />
        </AnimatedTransition>

        <Tabs defaultValue="betting">
          <TabsList className="mb-6">
            <TabsTrigger value="betting">Upcoming Matches</TabsTrigger>
            <TabsTrigger value="history">Bet History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="betting">
            <AnimatedTransition animation="fade" delay={200}>
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
                <MatchGrid matches={matches} onPlaceBet={handlePlaceBet} />
              </GlassCard>
            </AnimatedTransition>
          </TabsContent>
          
          <TabsContent value="history">
            <AnimatedTransition animation="fade" delay={200}>
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Betting History</h2>
                <BetHistory bets={bets} />
              </GlassCard>
            </AnimatedTransition>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
