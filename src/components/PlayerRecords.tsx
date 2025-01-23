import React, { useState } from "react";
import matchData from "../matches.json";
import realnames from "../playerinfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals, faHashtag } from "@fortawesome/free-solid-svg-icons";

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
    <div
      style={{ height: "80vh" }}
      className="bg p-6 rounded-lg space-y-6 text-white"
    >
      {/* <div className="mb-4 flex items-center space-x-4 text-sm">
        <label htmlFor="sortBy" className="text-sm font-semibold">
          Sort by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="matchesPlayed">Matches Played</option>
          <option value="points">Points</option>
        </select>
      </div> */}

      {players.length === 0 ? (
        <p className="text-gray-500">No players to display.</p>
      ) : (
        <div className="overflow-x-auto">
          <table
            style={{ maxWidth: "100px" }}
            className="w-1/2 min-w-full table-auto"
          >
            <thead>
              <tr className="text-left text-indigo-400">
                <th className="max-w-8 px-2 py-1 text-sm"></th>

                <th className="max-w-8 text-center px-2 py-1 text-lg">
                  <FontAwesomeIcon icon={faHashtag} />
                </th>

                <th className="max-w-8 text-center px-2 py-1 text-lg">
                  <span className="icon text-green-500">&#xe02d;</span>
                </th>
                <th className="max-w-8 text-center px-2 py-1  text-md">
                  <FontAwesomeIcon icon={faEquals} color="grey" />
                </th>
                <th className="max-w-8 text-center px-2 py-1 text-md">
                  <span className="icon text-red-500">&#xe02e;</span>
                </th>

                <th className="max-w-8 text-center text-md px-2 py-1 text-center">
                  P
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={player.name} className="">
                  <td className="flex items-center gap-2 px-2 py-1 text-md">
                    <span
                      className={`${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                          ? "text-gray-400"
                          : index === 2
                          ? "text-yellow-700"
                          : ""
                      }`}
                    >
                      #{index + 1}{" "}
                    </span>
                
                    <a
                      href={`https://lichess.org/@/${player.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      {realnames[player.name.toLocaleLowerCase()].name ??
                        player.name.toLocaleLowerCase()}{" "}
                      {player.currentWinStreak >= 2
                        ? `🔥${"🔥".repeat(player.currentWinStreak - 2)}`
                        : ""}
                    </a>
                  </td>

                  <td className="text-center max-w-8 ">
                    <span className="text-white">{player.matchesPlayed}</span>
                  </td>

                  <td className="text-center max-w-8 ">
                    <span className="text-green-500">{player.matchWins}</span>
                  </td>

                  <td className="text-center max-w-8 ">
                    <span className="text-gray-500">{player.matchDraws}</span>
                  </td>

                  <td className="text-center max-w-8 ">
                    <span className="text-red-500">{player.matchLosses}</span>
                  </td>

                  <td className="max-w-8  px-2 py-1 border-b border-gray-600 text-sm text-center">
                    {player.points}
                  </td>
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
