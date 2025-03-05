
import { Bet } from "@/types";
import { format } from "date-fns";

interface BetHistoryProps {
  bets: Bet[];
}

const BetHistory: React.FC<BetHistoryProps> = ({ bets }) => {
  if (bets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        You haven't placed any bets yet.
      </div>
    );
  }

  // Sort bets by date (newest first)
  const sortedBets = [...bets].sort((a, b) => 
    new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Odds
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Potential
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedBets.map((bet) => (
            <tr key={bet.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(bet.dateCreated), "MMM d, yyyy")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {bet.teamBetOn}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {bet.odds.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${bet.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${bet.potential.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${bet.status === "won" ? "bg-green-100 text-green-800" : 
                      bet.status === "lost" ? "bg-red-100 text-red-800" : 
                        "bg-yellow-100 text-yellow-800"}`}
                >
                  {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BetHistory;
