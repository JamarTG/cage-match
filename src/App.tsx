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
    <div className={`min-h-screen text-white`}>
      <main className="mx-auto px-2 py-8">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
           
            <li className="me-2">
              <a
                href="#"
                className="flex justify-center gap-2 items-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                aria-current="page"
                onClick={() => setActiveSection("upcomingMatches")}
              >
                <BaselineCalendarMonth className="text-xl hidden sm:block" />
                Schedule
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                className="flex gap-2 p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                onClick={() => setActiveSection("playerRecords")}
              >
                  <SharpPerson className="text-xl hidden sm:block" />
                Scoreboard
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                className="flex gap-2 p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                onClick={() => setActiveSection("matchHistory")}
            ><BaselineInsertChartOutlined className="text-xl hidden sm:block" />
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
