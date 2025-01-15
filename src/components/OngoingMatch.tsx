import { Chess } from "chess.js";
import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { updateChessInstance } from "../utils";

interface Match {
  date: string;
  time: string;
  player1Username: string;
  player2Username: string;
  score?: string;
}

interface OngoingMatchProps {
  match: Match;
}

const fetchPlayerGames = async (
  username: string,
  opponent: string,
  since: number
) => {
  try {
    const endOfDay = new Date(since);
    endOfDay.setHours(23, 59, 59, 999);
    const until = endOfDay.getTime();
    const response = await fetch(
      `https://lichess.org/api/games/user/${username}?max=10&since=${since}&until=${until}&vs=${opponent}&lastFen=true`,
      {
        headers: {
          Accept: "application/x-ndjson",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch games for ${username} against ${opponent}: ${response.statusText}`
      );
      return [];
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let ndjson = "";
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader?.read()!;
      done = doneReading;
      ndjson += decoder.decode(value, { stream: !done });
    }

    return ndjson
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
  } catch (error) {
    console.error(
      `Error fetching games for ${username} against ${opponent}:`,
      error
    );
    return [];
  }
};

const OngoingMatch: React.FC<OngoingMatchProps> = ({ match }) => {
  const [games, setGames] = useState<any[]>([]);
  const [currentMoveIndexes, setCurrentMoveIndexes] = useState<number[]>([]);
  const [chessInstances, setChessInstances] = useState<Chess[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const matchDate = new Date(`${match.date} ${match.time}`);
        if (isNaN(matchDate.getTime())) {
          throw new Error("Invalid match date or time");
        }
        const since = matchDate.getTime();
        console.log(matchDate);
        const games = await fetchPlayerGames(
          match.player1Username,
          match.player2Username,
          since
        );

        const chessInstances = games.map((game) => {
          const chess = new Chess();
          game.moves.split(" ").forEach((move: string) => chess.move(move));
          return chess;
        });

        setGames(games);
        setChessInstances(chessInstances);
        setCurrentMoveIndexes(new Array(games.length).fill(0));
        setCurrentGameIndex(games.length - 1);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchGames();
  }, [match]);

  const handleNextMove = (index: number) => {
    setCurrentMoveIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[index] = Math.min(
        newIndexes[index] + 1,
        games[index].moves.split(" ").length
      );
      updateChessInstance(index, newIndexes[index], setChessInstances, games);
      return newIndexes;
    });
  };

  const handlePreviousMove = (index: number) => {
    setCurrentMoveIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[index] = Math.max(newIndexes[index] - 1, 0);
      updateChessInstance(index, newIndexes[index], setChessInstances, games);
      return newIndexes;
    });
  };

  const handleNextGame = () => {
    setCurrentGameIndex((prevIndex) =>
      Math.min(prevIndex + 1, games.length - 1)
    );
  };

  const handlePreviousGame = () => {
    setCurrentGameIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className=" h-full w-full flex justify-center items-center p-5 text-xs text-white rounded-lg">
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="space-y-4">
          {games.length === 0 ? (
            <div className="text-center text-3xl text-gray-400 flex justify-center items-center">
              No Games Played
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex gap-3 text-gray-400 cursor-pointer p-4 rounded-lg">
                <button
                  className="text-white px-2 py-1 rounded"
                  onClick={handlePreviousGame}
                  disabled={currentGameIndex === 0}
                >
                  <svg
                    width="2em"
                    height="2em"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
                  </svg>
                </button>
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500">
                    Game {currentGameIndex + 1}
                  </div>
                  <div className="flex gap-2">
                    <span className="icon">&#xe028;</span>
                    <p className="text-xs">
                      {games[currentGameIndex].players.white.user.id} (
                      {games[currentGameIndex].players.white.rating})
                    </p>
                    <p
                      className={`text-xs ${
                        games[currentGameIndex].winner === "white"
                          ? "text-green-500"
                          : games[currentGameIndex].winner === "black"
                          ? "text-red-500"
                          : games[currentGameIndex].winner === "draw"
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }`}
                    >
                      {games[currentGameIndex].winner === "white"
                        ? 1
                        : games[currentGameIndex].winner === "black"
                        ? 0
                        : "½"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="icon">&#xe029;</span>
                    <p className="text-xs">
                      {games[currentGameIndex].players.black.user.id} (
                      {games[currentGameIndex].players.black.rating})
                    </p>
                    <p
                      className={`text-xs ${
                        games[currentGameIndex].winner === "black"
                          ? "text-green-500"
                          : games[currentGameIndex].winner === "white"
                          ? "text-red-500"
                          : games[currentGameIndex].winner === "draw"
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }`}
                    >
                      {games[currentGameIndex].winner === "black"
                        ? 1
                        : games[currentGameIndex].winner === "white"
                        ? 0
                        : "½"}
                    </p>
                  </div>
                  <div className="flex justify-center gap-2 w-full">
                    <button
                      className="text-white px-2 py-1 rounded"
                      onClick={() => handlePreviousMove(currentGameIndex)}
                    >
                      <svg
                        width="2em"
                        height="2em"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="m16 7-7 5 7 5zm-7 5V7H7v10h2z" />
                      </svg>
                    </button>
                    <button
                      className="text-white px-2 py-1 rounded"
                      onClick={() => handleNextMove(currentGameIndex)}
                    >
                      <svg
                        width="2em"
                        height="2em"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 7v10l7-5zm9 10V7h-2v10z" />
                      </svg>
                    </button>
                  </div>
                
                </div>
                

                <button
                  className="text-white px-2 py-1 rounded"
                  onClick={handleNextGame}
                  disabled={currentGameIndex === games.length - 1}
                >
                  <svg
                    width="2em"
                    height="2em"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center items-center w-full">
                  <Chessboard
                    boardWidth={Math.min(window.innerWidth, 250)}
                    position={chessInstances[currentGameIndex].fen()}
                  />
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OngoingMatch;