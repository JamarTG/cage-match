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
    <div className="min-h-screen text-white">
      <main className="mx-auto px-2 py-8">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="me-2 mb-2">
              <a
                href="#"
                onClick={() => setActiveSection("upcomingMatches")}
                className={`flex justify-center gap-2 items-center p-4 text-blue-600 ${
                  activeSection === "upcomingMatches" ? "border-b-2" : ""
                } rounded-t-lg active dark:text-blue-500 ${
                  activeSection === "upcomingMatches" ? "dark:border-red-500" : ""
                }`}
                aria-current="page"
              >
                <BaselineCalendarMonth className="text-xl hidden sm:block" />
                Schedule
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                onClick={() => setActiveSection("playerRecords")}
                className={`flex justify-center gap-2 items-center p-4 text-blue-600 ${
                  activeSection === "playerRecords" ? "border-b-2" : ""
                } rounded-t-lg active dark:text-blue-500 ${
                  activeSection === "playerRecords" ? "dark:border-red-500" : ""
                }`}
              >
                <SharpPerson className="text-xl hidden sm:block" />
                Scoreboard
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                onClick={() => setActiveSection("matchHistory")}
                className={`flex justify-center gap-2 items-center p-4 text-blue-600 ${
                  activeSection === "matchHistory" ? "border-b-2" : ""
                } rounded-t-lg active dark:text-blue-500 ${
                  activeSection === "matchHistory" ? "dark:border-red-500" : ""
                }`}
              >
                <BaselineInsertChartOutlined className="text-xl hidden sm:block" />
                Archive
              </a>
            </li>
          </ul>
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
