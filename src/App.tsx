import React, { useState } from "react";

import "./App.css";
import { SharpPerson } from "./components/svg/SharpPerson";
import { BaselineInsertChartOutlined } from "./components/svg/BaselineInsertChartOutlined";
import { BaselineCalendarMonth } from "./components/svg/BaselineCalendarMonth";
import UpcomingMatches from "./components/UpcomingMatches";
import PlayerRecords from "./components/PlayerRecords";
import MatchHistory from "./components/MatchHistory";

export interface Player {
  name: string;
  matchWins: number;
  matchLosses: number;
  gameWins: number;
  gameLosses: number;
  gameDraws: number;
  averageKilltime: number;
}

export interface Match {
  player1: string;
  player2: string;
  winner: string;
  loser: string;
}

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("upcomingMatches");

  return (
    <div className="min-h-screen text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Navigation Buttons */}
        <div className="flex justify-center mb-8">
          <button
            className={`flex justify-center items-center px-4 py-2 mx-2 gap-3 border-2 border-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
              activeSection === "upcomingMatches"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700"
            }`}
            onClick={() => setActiveSection("upcomingMatches")}
          >
            <BaselineCalendarMonth className="text-3xl" />
            Upcoming Matches
          </button>
          <button
            className={`flex justify-center items-center px-4 py-2 mx-2 gap-3 border-2 border-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
              activeSection === "playerRecords"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700"
            }`}
            onClick={() => setActiveSection("playerRecords")}
          >
            <SharpPerson className="text-3xl" />
            Player Records
          </button>
          <button
            className={`flex justify-center items-center px-4 py-2 mx-2 gap-3 border-2 border-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
              activeSection === "matchHistory"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700"
            }`}
            onClick={() => setActiveSection("matchHistory")}
          >
            <BaselineInsertChartOutlined className="text-3xl" />
            Match History
          </button>
        </div>

        {/* Main Content Layout */}
        {activeSection === "upcomingMatches" && <UpcomingMatches />}
        {activeSection === "playerRecords" && <PlayerRecords />}
        {activeSection === "matchHistory" && <MatchHistory />}
      </main>

      
        <div className="flex flex-col">
          <footer className="bg-gray-800 text-gray-400 p-2">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; 2025 by{" "}
            <a
          href="https://github.com/JamarTG"
          className="text-indigo-400 hover:underline"
          target="_blank"
            >
          JamarTG
            </a>
          </p>
        </div>
          </footer>
        </div>
 
    </div>
  );
};

export default App;
