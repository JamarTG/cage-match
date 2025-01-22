import { useState, useEffect } from "react";
import matchesData from "../matches.json";
import realnames from "../playerinfo";

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

          let player1Wins = 0;
          let player2Wins = 0;

          games.forEach((game) => {
            if (game.winner === "white") {
              player1Wins++;
            } else if (game.winner === "black") {
              player2Wins++;
            } else {
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

          return { id: matchId, date, player1, player2, winner, score, games };
        }
      );

      setMatchRecords(records);
    };

    transformMatches();
  }, []);

  const filteredRecords = matchRecords.filter((record) => {
    const query = searchQuery.toLowerCase();

    return (
      record.player1.toLowerCase().includes(query) ||
      record.player2.toLowerCase().includes(query) ||
      realnames[record.player1.toLowerCase()].name
        .toLocaleLowerCase()
        .includes(query) ||
      realnames[record.player2.toLowerCase()].name
        .toLocaleLowerCase()
        .includes(query)
    );
  });

  return (
    <div className=" rounded-lg p-4 space-y-4 text-white">
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by player name ..."
          className="p-2 rounded bg-transparent text-white w-full sm:w-1/2 border border-transparent focus:border-white border-2 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Match Records */}
      <div className="overflow-x-auto">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div key={record.id} className="rounded-lg bg-transparent p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
                <div className="flex flex-col items-center text-white font-semibold">
                  <p className="text-lg">
                    {realnames[record.player1.toLocaleLowerCase()]?.name ??
                      record.player1}
                  </p>
                  <a
                    className="text-blue-400 text-sm"
                    href={`https://lichess.org/@/${record.player1}`}
                  >
                    {record.player1}
                  </a>
                </div>

                <div className="flex justify-center items-center text-white font-bold text-3xl md:text-5xl">
                  {record.score}
                </div>

                {/* Player 2 */}
                <div className="flex flex-col items-center text-white font-semibold">
                  <p className="text-lg">
                    {realnames[record.player2.toLocaleLowerCase()]?.name ??
                      record.player2}
                  </p>
                  <a
                    className="text-blue-400 text-sm"
                    href={`https://lichess.org/@/${record.player2}`}
                  >
                    {record.player2}
                  </a>
                </div>
              </div>

              {/* Date and additional info */}
              <div className="text-gray-400 text-sm mt-2 text-center">
                {record.date} | @5:00 PM | Friendly
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;
