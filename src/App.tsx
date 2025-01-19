import React, { useState } from "react";

import "./App.css";
import { SharpPerson } from "./components/svg/SharpPerson";
import { BaselineInsertChartOutlined } from "./components/svg/BaselineInsertChartOutlined";
import { BaselineCalendarMonth } from "./components/svg/BaselineCalendarMonth";
import { Twitch } from "./components/svg/Twitch";
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
    <div className="min-h-screen bg-gray-900 text-white">
    

      <main className="container mx-auto px-4 py-8">
        {/* Navigation Buttons */}
        <div className="flex justify-center mb-8">
          <button
            className={`flex justify-center items-center px-4 py-2 mx-2 gap-3 ${
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
            className={`flex justify-center items-center px-4 py-2 mx-2 gap-3 ${
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
            className={`flex justify-center items-center px-4 py-2 mx-2 gap-3 ${
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

      <div className="min-h-screen flex flex-col">
        <footer className="bg-gray-800 text-gray-400 py-4 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 Loone Strength. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
