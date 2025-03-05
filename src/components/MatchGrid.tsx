
import { Match } from "@/types";
import { format } from "date-fns";
import BetSlip from "./BetSlip";

interface MatchGridProps {
  matches: Match[];
  onPlaceBet: (matchId: number, team: string, odds: number, amount: number) => void;
}

const MatchGrid: React.FC<MatchGridProps> = ({ matches, onPlaceBet }) => {
  // Format date for display
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  // Group matches by sport and then by league
  const matchesByLeague: Record<string, Match[]> = {};
  
  matches.forEach(match => {
    const key = match.league;
    if (!matchesByLeague[key]) {
      matchesByLeague[key] = [];
    }
    matchesByLeague[key].push(match);
  });

  return (
    <div className="space-y-6">
      {Object.entries(matchesByLeague).map(([league, leagueMatches]) => (
        <div key={league} className="bg-white/80 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-800 text-white py-2 px-4">
            <h3 className="font-semibold">{league}</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {leagueMatches.map((match) => (
              <div key={match.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      {formatMatchDate(match.startTime)}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <span className="font-medium">{match.homeTeam}</span>
                      <span className="hidden md:inline text-gray-400">vs</span>
                      <span className="font-medium">{match.awayTeam}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Home</span>
                      <span className="font-semibold">{match.homeOdds}</span>
                    </div>
                    
                    {match.drawOdds && (
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Draw</span>
                        <span className="font-semibold">{match.drawOdds}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Away</span>
                      <span className="font-semibold">{match.awayOdds}</span>
                    </div>
                    
                    <BetSlip match={match} onPlaceBet={onPlaceBet} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchGrid;
