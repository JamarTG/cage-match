import React from "react";
import { PlayerDetails } from "../types/interfaces";

interface PlayersInfoProps {
  players: PlayerDetails[];
  scores: number[];
}

const PlayersInfo: React.FC<PlayersInfoProps> = ({ players, scores }) => {
  if (players.length !== 2 || scores.length !== 2) {
    return <div>Error: Expected exactly 2 players and 2 scores.</div>;
  }

  return (
    <div className="flex items-center justify-center text-white gap-3">


      <div className="flex justify-center items-center w-full">
        <div className="flex flex-col items-center mb-4">
          <img
            src={`/${players[0].username.toLowerCase()}.jpg`}
            onError={(e) => {
              e.currentTarget.src = `/default.jpg`;
            }}
            alt={players[0].username}
            className="hidden md:block w-48 h-48 object-cover"
          />

          <div className="flex flex-col md:flex-row text-lg font-bold gap-1 justify-center items-center mt-4">
            <p className="flex gap-2 text-orange-400 text-sm sm:text-xs md:text-xs lg:text-sm xl:text-base whitespace-nowrap">
              {players[0].title || ""}
              <a
                href={players[0].url ? players[0].url : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex text-sm sm:text-xs md:text-xs lg:text-sm xl:text-base truncate capitalize text-blue-500 whitespace-nowrap"
              >
                {players[0].username || "Challenger 1"}
              </a>
            </p>
          </div>

          <div className="text-white text-lg font-bold mt-2">
            Score: {scores[0]}
          </div>
        </div>

        <div className="text-white text-lg font-bold mx-4">vs</div>

        <div className="flex flex-col items-center mb-4">
          <img
            src={`/${players[1].username.toLowerCase()}.jpeg`}
            onError={(e) => {
              e.currentTarget.src = `/default.jpg`;
            }}
            alt={players[1].username}
            className="hidden md:block w-48 h-48 object-cover"
          />

          <div className="flex flex-col md:flex-row text-lg font-bold gap-1 justify-center items-center mt-4">
            <p className="flex gap-2 text-orange-400 text-sm sm:text-xs md:text-xs lg:text-sm xl:text-base whitespace-nowrap">
              {players[1].title || ""}
              <a
                href={players[1].url ? players[1].url : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex text-sm sm:text-xs md:text-xs lg:text-sm xl:text-base truncate capitalize text-blue-500 whitespace-nowrap"
              >
                {players[1].username || "Challenger 2"}
              </a>
            </p>
          </div>

          <div className="text-white text-lg font-bold mt-2">
            Score: {scores[1]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersInfo;
