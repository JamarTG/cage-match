import React, { useState } from "react";
import matchData from "../matches.json";
import realnames from "../playerinfo";
import playerInfo from "../playerinfo";

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
  points: number;
  currentWinStreak: number;
  latestRating: number;
  performanceScore: number;
}

const calculateMatchStats = (): PlayerStats[] => {
  const playerStats: { [key: string]: PlayerStats } = {};

  Object.values(matchData).forEach((games) => {
    const matchResults: {
      [key: string]: { wins: number; losses: number; draws: number };
    } = {};

    games.forEach((game: any) => {
      const { winner, players } = game;
      const whitePlayer = players.white.user.name;
      const blackPlayer = players.black.user.name;
      const whiteRating = players.white.rating;
      const blackRating = players.black.rating;

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
          currentWinStreak: 0, // Initialize win streak
          latestRating: whiteRating, // Initialize rating
          performanceScore: 0, // Initialize performance score
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
          points: 0,
          currentWinStreak: 0,
          latestRating: blackRating,
          performanceScore: 0,
        };
      }

      if (!matchResults[whitePlayer]) {
        matchResults[whitePlayer] = { wins: 0, losses: 0, draws: 0 };
      }
      if (!matchResults[blackPlayer]) {
        matchResults[blackPlayer] = { wins: 0, losses: 0, draws: 0 };
      }

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

      playerStats[whitePlayer].latestRating = players.white.rating;
      playerStats[blackPlayer].latestRating = players.black.rating;
    });

    Object.keys(matchResults).forEach((player) => {
      const { wins, losses } = matchResults[player];
      playerStats[player].matchesPlayed++;
      if (wins > losses) {
        playerStats[player].matchWins++;
        playerStats[player].points += 1; // Award 1 point for a win
        playerStats[player].currentWinStreak++;
      } else if (losses > wins) {
        playerStats[player].matchLosses++;
        playerStats[player].points -= 1; // Deduct 1 point for a loss
        playerStats[player].currentWinStreak = 0;
      } else {
        playerStats[player].matchDraws++;
      }
    });
  });

  Object.values(playerStats).forEach((stats) => {
    const totalMatches = stats.matchWins + stats.matchLosses + stats.matchDraws;
    const totalGames = stats.gameWins + stats.gameLosses + stats.gameDraws;
    stats.matchWinPercentage = totalMatches
      ? (stats.matchWins / totalMatches) * 100
      : 0;
    stats.gameWinPercentage = totalGames
      ? (stats.gameWins / totalGames) * 100
      : 0;

    // Calculate performance score
    stats.performanceScore =
      stats.matchWins * 3 +
      stats.gameWins * 1.5 +
      stats.matchWinPercentage * 2 +
      stats.gameWinPercentage * 1 +
      stats.points * 2;
  });

  return Object.values(playerStats);
};

const PlayerRecords: React.FC = () => {
  const [sortBy, _] = useState<string>("performanceScore");

  const players = calculateMatchStats();

  const sortedPlayers = [...players].sort((a, b) => {
    switch (sortBy) {
      case "performanceScore":
        return b.performanceScore - a.performanceScore;
      case "matchWinPercentage":
        return b.matchWinPercentage - a.matchWinPercentage;
      case "gameWinPercentage":
        return b.gameWinPercentage - a.gameWinPercentage;
      default:
        return 0;
    }
  });

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
      
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Rank
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Record
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="w-4 p-4">
                <div className="flex items-center justify-center">{`#${
                  index + 1
                }`}</div>
              </td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={`/${
                      playerInfo[player.name.toLocaleLowerCase()].image
                    }`}
                    alt="Jese image"
                    onError={(e) => {
                      e.currentTarget.onerror = null; // Prevents infinite loop if default.jpg also fails
                      e.currentTarget.src = "/default.jpg"; // Path to your default image
                    }}
                  />
                </div>

                <div className="ps-3">
                  <div className="text- font-semibold">
                    <a
                      href={`https://lichess.org/@/${player.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {player.name}
                    </a>
                    {player.currentWinStreak >= 2
                      ? `🔥${"🔥".repeat(player.currentWinStreak - 2)}`
                      : ""}
                  </div>

                  <div className="font-normal text-gray-300">
                    {realnames[player.name.toLocaleLowerCase()].name ??
                      player.name.toLocaleLowerCase()}{" "}
                  </div>
                </div>
              </th>
              <td className="px-6 py-4 gap-2 relative group">
                <div className="flex gap-2">
                  <span className="text-green-500 group-hover:hidden">
                    {player.matchWins}W
                  </span>
                  <span className="text-red-500 group-hover:hidden">
                    {player.matchLosses}L
                  </span>

                  <span className="text-blue-500 absolute group-hover:block hidden">
                    {(
                      (player.matchWins /
                        (player.matchWins + player.matchLosses)) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerRecords;
