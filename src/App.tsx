import React, { useState, useEffect } from "react";
import "./App.css";
import { SharpPerson } from "./components/svg/SharpPerson";
import { BaselineInsertChartOutlined } from "./components/svg/BaselineInsertChartOutlined";
import { BaselineCalendarMonth } from "./components/svg/BaselineCalendarMonth";
import UpcomingMatches from "./components/UpcomingMatches";
import PlayerRecords from "./components/PlayerRecords";
import MatchHistory from "./components/MatchHistory";
import Loader from "./components/Loader";

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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${activeSection === "upcomingMatches" ? "smoke" : "chess"
    } min-h-screen text-white`}>
      <main className="container mx-auto px-2 py-8">
        <div className="flex justify-center w-full w-full mb-8 text-xs lg:text-sm md:text-xs sm:text-xs">
          <button
            className={`flex justify-center items-center px-4 py-1 mx-2 gap-3 border-2 border-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
              activeSection === "upcomingMatches"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700"
            }`}
            onClick={() => setActiveSection("upcomingMatches")}
          >
            <BaselineCalendarMonth className="text-xl hidden sm:block" />
            Schedule
          </button>
          <button
            className={`flex justify-center items-center px-4 py-1 mx-2 gap-3 border-2 border-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
              activeSection === "playerRecords"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700"
            }`}
            onClick={() => setActiveSection("playerRecords")}
          >
            <SharpPerson className="text-xl hidden sm:block" />
            Leaderboard
          </button>
          <button
            className={`flex justify-center items-center px-4 py-1 mx-2 gap-3 border-2 border-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
              activeSection === "matchHistory"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700"
            }`}
            onClick={() => setActiveSection("matchHistory")}
          >
            <BaselineInsertChartOutlined className="text-xl hidden sm:block" />
            Archive
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {activeSection === "upcomingMatches" && <UpcomingMatches />}
            {activeSection === "playerRecords" && <PlayerRecords />}
            {activeSection === "matchHistory" && <MatchHistory />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
