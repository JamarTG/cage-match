import React, { useState } from "react";
import { Match, PlayerDetails } from "../types/interfaces";
import OngoingMatch from "./OngoingMatch";

interface PlayersInfoProps {
  players: PlayerDetails[];
  scores: number[];
  match: Match;
}

const PlayersInfo: React.FC<PlayersInfoProps> = ({
  players,
  scores,
  match,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (players.length !== 2 || scores.length !== 2) {
    return <div>Error: Expected exactly 2 players and 2 scores.</div>;
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full text-white p-4">
      <button
      onClick={toggleModal}
      className="flex justify-center items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded text-lg sm:hidden"
      >
      <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24">
        <path
        fill="currentColor"
        d="M18 3h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM11.5 9h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zM5 16h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z"
        />
      </svg>{" "}
      View Games
      </button>

      {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-black text-gray p-6 rounded transform transition-transform duration-300 ease-in-out translate-y-0">
        <button
          onClick={toggleModal}
          className="absolute top-2 right-2 text-lg"
        >
          <svg width="3em" height="3em" fill="gray" viewBox="0 0 1024 1024">
          <path d="M880 112c17.7 0 32 14.3 32 32v736c0 17.7-14.3 32-32 32H144c-17.7 0-32-14.3-32-32V144c0-17.7 14.3-32 32-32zM639.978 338.82l-.034.006c-.023.007-.042.018-.083.059L512 466.745l-127.86-127.86c-.042-.041-.06-.052-.084-.059a.118.118 0 0 0-.07 0c-.022.007-.041.018-.082.059l-45.02 45.019c-.04.04-.05.06-.058.083a.118.118 0 0 0 0 .07l.01.022a.268.268 0 0 0 .049.06L466.745 512l-127.86 127.862c-.041.04-.052.06-.059.083a.118.118 0 0 0 0 .07c.007.022.018.041.059.082l45.019 45.02c.04.04.06.05.083.058a.118.118 0 0 0 .07 0c.022-.007.041-.018.082-.059L512 557.254l127.862 127.861c.04.041.06.052.083.059a.118.118 0 0 0 .07 0c.022-.007.041-.018.082-.059l45.02-45.019c.04-.04.05-.06.058-.083a.118.118 0 0 0 0-.07l-.01-.022a.268.268 0 0 0-.049-.06L557.254 512l127.861-127.86c.041-.042.052-.06.059-.084a.118.118 0 0 0 0-.07c-.007-.022-.018-.041-.059-.082l-45.019-45.02a.199.199 0 0 0-.083-.058.118.118 0 0 0-.07 0z" />
          </svg>
        </button>
        <OngoingMatch match={match} />
        </div>
      </div>
      )}

      <div className="flex justify-center items-center w-full">
      <div className="flex flex-col items-center mb-4 hidden sm:flex">
        <img
        src={`/${players[0].username.toLowerCase()}.jpg`}
        onError={(e) => {
          e.currentTarget.src = `/default.jpg`;
        }}
        alt={players[0].username}
        className="w-96 h-96 object-cover border-4 border-yellow-300 rounded-lg shadow-lg"
        />
        <div className="flex flex-col md:flex-row text-xl font-bold gap-2 justify-center items-center mt-4">
        <p className="flex gap-2 text-orange-400 text-sm sm:text-sm md:text-sm lg:text-lg xl:text-xl whitespace-nowrap">
          {players[0].title || ""}
          <a
          href={players[0].url ? players[0].url : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex text-sm sm:text-sm md:text-sm lg:text-lg xl:text-xl truncate capitalize text-blue-500 whitespace-nowrap"
          >
          {players[0].username || "Challenger 1"}
          </a>
        </p>
        <p className="text-sm sm:text-sm md:text-sm lg:text-lg xl:text-xl text-gray-400">
          {players[0].rating || "N/A"}
        </p>
        <img
          src={`/jam.png`}
          // alt={players[1].country}
          className="w-8 object-cover"
        />
        </div>
      </div>

      <div className="text-white text-xl font-bold mx-6 hidden sm:block">vs</div>

      <div className="flex flex-col items-center mb-4 hidden sm:flex">
        <img
        src={`/${players[1].username.toLowerCase()}.jpeg`}
        onError={(e) => {
          e.currentTarget.src = `/default.jpg`;
        }}
        alt={players[1].username}
        className="w-96 h-96 object-cover border-4 border-gold rounded-lg shadow-lg"
        />

        <div className="flex flex-col md:flex-row text-xl font-bold gap-2 justify-center items-center mt-4">
        <p className="flex gap-2 text-orange-400 text-sm sm:text-sm md:text-sm lg:text-lg xl:text-xl whitespace-nowrap">
          {players[1].title || ""}
          <a
          href={players[1].url ? players[1].url : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex text-sm sm:text-sm md:text-sm lg:text-lg xl:text-xl truncate capitalize text-blue-500 whitespace-nowrap"
          >
          {players[1].username || "Challenger 2"}
          </a>
        </p>
        <p className="text-sm sm:text-sm md:text-sm lg:text-lg xl:text-xl text-gray-400">
          {players[1].rating || "N/A"}
        </p>
        <img
          src={`/jam.png`}
          // alt={players[1].country}
          className="w-8 object-cover"
        />
        </div>
      </div>
      </div>
    </div>
  );
};

export default PlayersInfo;
