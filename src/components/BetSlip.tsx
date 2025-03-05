
import { useAuth } from "@/context/AuthContext";
import { Match } from "@/types";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

interface BetSlipProps {
  match: Match;
  onPlaceBet: (matchId: number, team: string, odds: number, amount: number) => void;
}

const BetSlip: React.FC<BetSlipProps> = ({ match, onPlaceBet }) => {
  const { user, updateBalance } = useAuth();
  const [betAmount, setBetAmount] = useState(10);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedOdds, setSelectedOdds] = useState(0);
  const [open, setOpen] = useState(false);

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
    
    if (team === match.homeTeam) {
      setSelectedOdds(match.homeOdds);
    } else if (team === match.awayTeam) {
      setSelectedOdds(match.awayOdds);
    } else if (team === "Draw" && match.drawOdds) {
      setSelectedOdds(match.drawOdds);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate bet
    if (betAmount <= 0) {
      toast.error("Bet amount must be greater than 0");
      return;
    }
    
    if (!selectedTeam) {
      toast.error("Please select a team to bet on");
      return;
    }
    
    if (!user || (user.balance || 0) < betAmount) {
      toast.error("Insufficient balance");
      return;
    }
    
    // Place bet
    onPlaceBet(match.id, selectedTeam, selectedOdds, betAmount);
    
    // Deduct from balance
    updateBalance(-betAmount);
    
    // Close dialog and reset form
    setOpen(false);
    resetForm();
    
    toast.success(`Bet placed on ${selectedTeam} for $${betAmount}`);
  };

  const resetForm = () => {
    setBetAmount(10);
    setSelectedTeam("");
    setSelectedOdds(0);
  };

  const potentialWinnings = betAmount * selectedOdds;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Place Bet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Place Your Bet</DialogTitle>
          <DialogDescription>
            {match.homeTeam} vs {match.awayTeam}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="team">Select Outcome</Label>
            <Select onValueChange={handleTeamSelect} value={selectedTeam}>
              <SelectTrigger id="team">
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-white">
                <SelectItem value={match.homeTeam}>
                  {match.homeTeam} ({match.homeOdds})
                </SelectItem>
                <SelectItem value={match.awayTeam}>
                  {match.awayTeam} ({match.awayOdds})
                </SelectItem>
                {match.drawOdds && (
                  <SelectItem value="Draw">
                    Draw ({match.drawOdds})
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Bet Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span>Odds:</span>
              <span>{selectedOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Potential Win:</span>
              <span>${potentialWinnings.toFixed(2)}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Place Bet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BetSlip;
