import React, { useState } from "react";
import matchData from "../matches.json"; // Assuming the JSON data is in this path

interface PlayerStats {
  name: string;
  matchWins: number;
  matchLosses: number;
  matchDraws: number;
  gameWins: number;
  gameLosses: number;
  gameDraws: number;
  matchWinPercentage: number;
  gameWinPercentage: number;
  matchesPlayed: number;
  points: number; // New property
}

const calculateMatchStats = (): PlayerStats[] => {
  const playerStats: { [key: string]: PlayerStats } = {};

  Object.values(matchData).forEach((games) => {
    const matchResults: { [key: string]: { wins: number; losses: number; draws: number } } = {};

    games.forEach((game: any) => {
      const { winner, players } = game;
      const whitePlayer = players.white.user.name;
      const blackPlayer = players.black.user.name;

      // Initialize player stats if not already
      if (!playerStats[whitePlayer]) {
        playerStats[whitePlayer] = {
          name: whitePlayer,
          matchWins: 0,
          matchLosses: 0,
          matchDraws: 0,
          gameWins: 0,
          gameLosses: 0,
          gameDraws: 0,
          matchWinPercentage: 0,
          gameWinPercentage: 0,
          matchesPlayed: 0,
          points: 0, // Initialize points
        };
      }
      if (!playerStats[blackPlayer]) {
        playerStats[blackPlayer] = {
          name: blackPlayer,
          matchWins: 0,
          matchLosses: 0,
          matchDraws: 0,
          gameWins: 0,
          gameLosses: 0,
          gameDraws: 0,
          matchWinPercentage: 0,
          gameWinPercentage: 0,
          matchesPlayed: 0,
          points: 0, // Initialize points
        };
      }

      // Initialize match results if not already
      if (!matchResults[whitePlayer]) {
        matchResults[whitePlayer] = { wins: 0, losses: 0, draws: 0 };
      }
      if (!matchResults[blackPlayer]) {
        matchResults[blackPlayer] = { wins: 0, losses: 0, draws: 0 };
      }

      // Update game stats
      if (winner === "white") {
        playerStats[whitePlayer].gameWins++;
        playerStats[blackPlayer].gameLosses++;
        matchResults[whitePlayer].wins++;
        matchResults[blackPlayer].losses++;
      } else if (winner === "black") {
        playerStats[blackPlayer].gameWins++;
        playerStats[whitePlayer].gameLosses++;
        matchResults[blackPlayer].wins++;
        matchResults[whitePlayer].losses++;
      } else {
        playerStats[whitePlayer].gameDraws++;
        playerStats[blackPlayer].gameDraws++;
        matchResults[whitePlayer].draws++;
        matchResults[blackPlayer].draws++;
      }
    });

    Object.keys(matchResults).forEach((player) => {
      const { wins, losses} = matchResults[player];
      playerStats[player].matchesPlayed++;
      if (wins > losses) {
        playerStats[player].matchWins++;
        playerStats[player].points += 3; 
      } else if (losses > wins) {
        playerStats[player].matchLosses++;
      } else {
        playerStats[player].matchDraws++;
        playerStats[player].points += 1;
      }
    });
  });

  // Calculate win percentages
  Object.values(playerStats).forEach((stats) => {
    const totalMatches = stats.matchWins + stats.matchLosses + stats.matchDraws;
    const totalGames = stats.gameWins + stats.gameLosses + stats.gameDraws;
    stats.matchWinPercentage = totalMatches ? (stats.matchWins / totalMatches) * 100 : 0;
    stats.gameWinPercentage = totalGames ? (stats.gameWins / totalGames) * 100 : 0;
  });

  return Object.values(playerStats);
};

const getPercentageColor = (percentage: number): string => {
  if (percentage >= 75) return "text-green-500";
  if (percentage >= 50) return "text-yellow-500";
  return "text-red-500";
};

const PlayerRecords: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>("matchWins");

  const players = calculateMatchStats();

  const sortedPlayers = [...players].sort((a, b) => {
    switch (sortBy) {
      case "matchWins":
        return b.matchWins - a.matchWins;
      case "matchLosses":
        return b.matchLosses - a.matchLosses;
      case "matchDraws":
        return b.matchDraws - a.matchDraws;
      case "gameWins":
        return b.gameWins - a.gameWins;
      case "gameLosses":
        return b.gameLosses - a.gameLosses;
      case "gameDraws":
        return b.gameDraws - a.gameDraws;
      case "matchWinPercentage":
        return b.matchWinPercentage - a.matchWinPercentage;
      case "gameWinPercentage":
        return b.gameWinPercentage - a.gameWinPercentage;
      case "matchesPlayed":
        return b.matchesPlayed - a.matchesPlayed;
      case "points":
        return b.points - a.points;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg">
      <div className="mb-4">
        <label htmlFor="sortBy" className="mr-2 text-sm font-semibold">
          Sort by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded bg-gray-800 text-white"
        >
          <option value="matchWins">🏆 Match Wins</option>
          <option value="matchLosses">❌ Match Losses</option>
          <option value="matchDraws">🤝 Match Draws</option>
          <option value="gameWins">🏆 Game Wins</option>
          <option value="gameLosses">❌ Game Losses</option>
          <option value="gameDraws">🤝 Game Draws</option>
          <option value="matchWinPercentage">🏆 Match Win %</option>
          <option value="gameWinPercentage">🏆 Game Win %</option>
          <option value="matchesPlayed">🏆 Matches Played</option>
          <option value="points">🏆 Points</option> {/* New option */}
        </select>
      </div>

      {players.length === 0 ? (
        <p className="text-gray-500">No players to display.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Player</th>
                <th className="px-4 py-2 text-left">Match Record</th>
                <th className="px-4 py-2 text-left">Game Record</th>
                <th className="px-4 py-2 text-left">Match Win %</th>
                <th className="px-4 py-2 text-left">Game Win %</th>
                <th className="px-4 py-2 text-left">Matches Played</th>
                <th className="px-4 py-2 text-left">Points</th> {/* New column */}
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={player.name} className="border-b border-gray-700">
                  <td className="px-4 py-2 font-semibold">{index + 1}</td>
                  <td className="px-4 py-2">{player.name}</td>
                  <td className="px-4 py-2">
                    <span className="text-green-500">{player.matchWins}W</span> / 
                    <span className="text-red-500">{player.matchLosses}L</span> / 
                    <span className="text-gray-500">{player.matchDraws}D</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-green-500">{player.gameWins}W</span> / 
                    <span className="text-red-500">{player.gameLosses}L</span> / 
                    <span className="text-gray-500">{player.gameDraws}D</span>
                  </td>
                  <td className={`px-4 py-2 ${getPercentageColor(player.matchWinPercentage)}`}>
                    {player.matchWinPercentage.toFixed(2)}%
                  </td>
                  <td className={`px-4 py-2 ${getPercentageColor(player.gameWinPercentage)}`}>
                    {player.gameWinPercentage.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2">{player.matchesPlayed}</td>
                  <td className="px-4 py-2">{player.points}</td> {/* Display points */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlayerRecords;
