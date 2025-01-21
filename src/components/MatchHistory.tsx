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

          return { id: matchId, date, player1, player2, winner, score };
        }
      );

      setMatchRecords([
        ...records,
 
      ]);
    };

    transformMatches();
  }, []);

  return (
    <div
      style={{ height: "80vh" }}
      className="bg p-6 rounded-lg space-y-3 text-white"
    >
      <div className="overflow-x-auto">
        <div className="flex justify-center items-center overflow-y-auto">
          <div>
            {matchRecords.map((record) => (
              <div className="rounded-lg m-3">
                <div className="flex items-center gap-6 text-sm lg:text-lg md:text-md sm:text-md xs:text-xs 2xs:text-2xs">
                  <div className="flex flex-col text-white font-semibold">
                    <p>
                      {realnames[record.player1.toLocaleLowerCase()].name ??
                        record.player1}
                    </p>

                    <div className="flex justify-center items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="1em"
                        height="1em"
                      >
                        <path
                          fill="currentColor"
                          d="M10.457 6.161a.237.237 0 0 0-.296.165c-.8 2.785 2.819 5.579 5.214 7.428c.653.504 1.216.939 1.591 1.292c1.745 1.642 2.564 2.851 2.733 3.178a.24.24 0 0 0 .275.122c.047-.013 4.726-1.3 3.934-4.574a.3.3 0 0 0-.023-.06L18.204 3.407L18.93.295a.24.24 0 0 0-.262-.293c-1.7.201-3.115.435-4.5 1.425c-4.844-.323-8.718.9-11.213 3.539C.334 7.737-.246 11.515.085 14.128c.763 5.655 5.191 8.631 9.081 9.532c.993.229 1.974.34 2.923.34c3.344 0 6.297-1.381 7.946-3.85a.24.24 0 0 0-.372-.3c-3.411 3.527-9.002 4.134-13.296 1.444c-4.485-2.81-6.202-8.41-3.91-12.749C4.741 4.221 8.801 2.362 13.888 3.31c.056.01.115 0 .165-.029l.335-.197c.926-.546 1.961-1.157 2.873-1.279l-.694 1.993a.24.24 0 0 0 .02.202l6.082 10.192c-.193 2.028-1.706 2.506-2.226 2.611c-.287-.645-.814-1.364-2.306-2.803c-.422-.407-1.21-.941-2.124-1.56c-2.364-1.601-5.937-4.02-5.391-5.984a.24.24 0 0 0-.165-.295"
                        ></path>
                      </svg>
                      <a
                        className="text-blue-400"
                        href={`https://lichess.org/@/{record.player1}`}
                      >
                        {record.player1}
                      </a>
                    </div>
                  </div>
                  <div className="text-white sm:text lg:text-5xl md:text-3xl sm:text-md font-bold">
                    {record.score}
                  </div>

                  <div className="flex flex-col text-white font-semibold">
                    <p>
                      {realnames[record.player2.toLocaleLowerCase()].name ??
                        record.player2}
                    </p>

                    <div className="flex justify-center items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="1em"
                        height="1em"
                      >
                        <path
                          fill="currentColor"
                          d="M10.457 6.161a.237.237 0 0 0-.296.165c-.8 2.785 2.819 5.579 5.214 7.428c.653.504 1.216.939 1.591 1.292c1.745 1.642 2.564 2.851 2.733 3.178a.24.24 0 0 0 .275.122c.047-.013 4.726-1.3 3.934-4.574a.3.3 0 0 0-.023-.06L18.204 3.407L18.93.295a.24.24 0 0 0-.262-.293c-1.7.201-3.115.435-4.5 1.425c-4.844-.323-8.718.9-11.213 3.539C.334 7.737-.246 11.515.085 14.128c.763 5.655 5.191 8.631 9.081 9.532c.993.229 1.974.34 2.923.34c3.344 0 6.297-1.381 7.946-3.85a.24.24 0 0 0-.372-.3c-3.411 3.527-9.002 4.134-13.296 1.444c-4.485-2.81-6.202-8.41-3.91-12.749C4.741 4.221 8.801 2.362 13.888 3.31c.056.01.115 0 .165-.029l.335-.197c.926-.546 1.961-1.157 2.873-1.279l-.694 1.993a.24.24 0 0 0 .02.202l6.082 10.192c-.193 2.028-1.706 2.506-2.226 2.611c-.287-.645-.814-1.364-2.306-2.803c-.422-.407-1.21-.941-2.124-1.56c-2.364-1.601-5.937-4.02-5.391-5.984a.24.24 0 0 0-.165-.295"
                        ></path>
                      </svg>
                      <a
                        className="text-blue-400"
                        href={`https://lichess.org/@/{record.player2}`}
                      >
                        {record.player2}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  {record.date} | @5:00 PM | Friendly
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {matchRecords.length === 0 && (
        <p className="text-gray-400 text-center">No match history available.</p>
      )}
    </div>
  );
};

export default MatchHistory;
