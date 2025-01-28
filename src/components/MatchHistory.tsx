import { useState, useEffect } from "react";
import matchesData from "../matches.json";

import playerInfo from "../playerinfo";

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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const transformMatches = () => {
      const records: MatchRecord[] = Object.entries(matchesData).map(
        ([matchId, games]: [string, any[]]) => {
          const player1 = games[0].players.white.user.name;
          const player2 = games[0].players.black.user.name;
          const date = new Date(games[0].createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          );

          const scores = {
            [player1.toLowerCase()]: 0,
            [player2.toLowerCase()]: 0,
          };

          let player1Wins = 0;
          let player2Wins = 0;

          console.log("==============================");

          for (const game of games) {
            if (game.winner === "white") {
              scores[game.players.white.user.id] += 1;
              player1Wins++;
            } else if (game.winner === "black") {
              scores[game.players.black.user.id] += 1;
              player2Wins++;
            } else {
              scores[game.players.black.user.id] += 0.5;
              scores[game.players.white.user.id] += 0.5;
            }

            console.log(scores);

            if (
              scores[game.players.white.user.id] === 7 ||
              scores[game.players.black.user.id] === 7
            ) {
              break;
            }
          }

          const winner =
            player1Wins > player2Wins
              ? player1
              : player2Wins > player1Wins
              ? player2
              : "Draw";

          console.log(player1.toLocaleLowerCase(), player2.toLocaleLowerCase());
          const score = `${scores[player1.toLowerCase()]} - ${
            scores[player2.toLowerCase()]
          }`;

          return { id: matchId, date, player1, player2, winner, score, games };
        }
      );

      setMatchRecords(records.reverse());
    };

    transformMatches();
  }, []);

  const filteredRecords = matchRecords.filter((record) => {
    const query = searchQuery.toLowerCase();

    return (
      record.player1.toLowerCase().includes(query) ||
      record.player2.toLowerCase().includes(query) ||
      playerInfo[record.player1.toLowerCase()].name
        .toLocaleLowerCase()
        .includes(query) ||
      playerInfo[record.player2.toLowerCase()].name
        .toLocaleLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="rounded-lg p-4 space-y-4 text-white">
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by player name ..."
          className="p-2 rounded bg-gray-800 text-white w-full sm:w-1/2 border border-transparent focus:border-white border-2 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((record, index) => (
              <div
                key={index}
                className="bg-white border dark:bg-gray-800 flex flex-col items-center justify-center dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 p-4 rounded-lg"
              >
                {/* Player 1 */}
                <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={`/${
                        playerInfo[record.player1.toLocaleLowerCase()].image
                      }`}
                      alt={`${record.player1} image`}
                      onError={(e) => {
                        e.currentTarget.onerror = null; // Prevents infinite loop if default.jpg also fails
                        e.currentTarget.src = "/default.jpg"; // Path to your default image
                      }}
                    />
                  </div>

                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {record.player1}
                    </div>
                    <div className="font-normal text-gray-500">
                      {playerInfo[record.player1.toLocaleLowerCase()].name}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center justify-center bg-indigo-500 text-white font-bold py-1 px-4 rounded-full shadow-md mb-2">
                  {record.score}
                </div>

                {/* Player 2 */}
                <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={`/${
                        playerInfo[record.player2.toLocaleLowerCase()].image
                      }`}
                      alt={`${record.player2} image`}
                      onError={(e) => {
                        e.currentTarget.onerror = null; // Prevents infinite loop if default.jpg also fails
                        e.currentTarget.src = "/default.jpg"; // Path to your default image
                      }}
                    />
                  </div>

                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {record.player2}
                    </div>
                    <div className="font-normal text-gray-500">
                      {playerInfo[record.player2.toLocaleLowerCase()].name}
                    </div>
                  </div>
                </div>

                {/* Match Date */}
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    weekday: "short", // Abbreviated weekday (e.g., "Mon")
                    year: "numeric", // Full year (e.g., "2025")
                    month: "short", // Abbreviated month (e.g., "Jan")
                    day: "numeric", // Day of the month (e.g., "28")
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;
