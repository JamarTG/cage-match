import { useState, useEffect } from "react";
import matchesData from "../matches.json"

interface MatchRecord {
  id: string;
  date: string;
  player1: string;
  player2: string;
  winner: string;
  score: string;
}

const MatchHistory = () => {
  const [matchRecords, setMatchRecords] = useState<MatchRecord[]>([]);

  useEffect(() => {
    const transformMatches = () => {
      const records: MatchRecord[] = Object.entries(matchesData).map(
        ([matchId, games]: [string, any[]]) => {
          const player1 = games[0].players.white.user.name;
          const player2 = games[0].players.black.user.name;
          const date = new Date(games[0].createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          // Calculate score based on games
          let player1Wins = 0;
          let player2Wins = 0;

          games.forEach((game) => {
            if (game.winner === "white") {
              player1Wins++;
            } else if (game.winner === "black") {
              player2Wins++;
            } else {
              // Handle draw
              player1Wins += 0.5;
              player2Wins += 0.5;
            }
          });

          const winner =
            player1Wins > player2Wins
              ? player1
              : player2Wins > player1Wins
              ? player2
              : "Draw";
          const score = `${player1Wins} - ${player2Wins}`;

          return { id: matchId, date, player1, player2, winner, score };
        }
      );

      setMatchRecords(records);
    };

    transformMatches();
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 text-white">
      <h2 className="text-2xl font-bold text-indigo-400">Match History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-indigo-400">
              <th className="px-4 py-2 border-b border-gray-600">Date</th>
              <th className="px-4 py-2 border-b border-gray-600">Players</th>
              <th className="px-4 py-2 border-b border-gray-600">Winner</th>
              <th className="px-4 py-2 border-b border-gray-600">Score</th>
            </tr>
          </thead>
          <tbody>
            {matchRecords.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-indigo-600 transition duration-300"
              >
                <td className="px-4 py-2 border-b border-gray-600">
                  {record.date}
                </td>
                <td className="px-4 py-2 border-b border-gray-600">
                  {record.player1} vs {record.player2}
                </td>
                <td className="px-4 py-2 border-b border-gray-600">
                  {record.winner}
                </td>
                <td className="px-4 py-2 border-b border-gray-600">
                  {record.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {matchRecords.length === 0 && (
        <p className="text-gray-400 text-center">No match history available.</p>
      )}
    </div>
  );
};

export default MatchHistory;
