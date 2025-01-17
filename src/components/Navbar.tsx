import React, { useState, useEffect } from "react";
import { Match } from "./Store";

interface NavbarProps {
  playerOneUsername: string;
  playerOneScore: number;
  playerTwoUsername: string;
  playerTwoScore: number;
  match: Match;
}

const Navbar: React.FC<NavbarProps> = ({
  playerOneUsername,
  playerOneScore,
  playerTwoUsername,
  playerTwoScore,
  match: { date, time },
}) => {

  function calculateTimeDifference(date: string, time: string) {
    if (!time) return "";

    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const matchDateTime = new Date(date);
    matchDateTime.setHours(hours, minutes, 0, 0);
    const now = new Date();
    const diffInSeconds = Math.round(
      (matchDateTime.getTime() - now.getTime()) / 1000
    );

    if (diffInSeconds <= 0) {
      const elapsedSeconds = Math.abs(diffInSeconds);
      if (elapsedSeconds >= 3 * 60 * 60) {
        return "Match Ended";
      }
      return "Match Ongoing";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const remainingSeconds = diffInSeconds % 60;
    const diffInHours = Math.floor(diffInMinutes / 60);
    const remainingMinutes = diffInMinutes % 60;
    const diffInDays = Math.floor(diffInHours / 24);
    const remainingHours = diffInHours % 24;

    const daysDisplay = diffInDays > 0 ? `${diffInDays}d ` : "";
    const hoursDisplay = remainingHours > 0 || diffInDays > 0 ? `${remainingHours}h ` : "";
    const minutesDisplay = remainingMinutes > 0 || (diffInDays > 0 || remainingHours > 0) ? `${remainingMinutes}m ` : "";
    const secondsDisplay = `${remainingSeconds}s`;

    return `${daysDisplay}${hoursDisplay}${minutesDisplay}${secondsDisplay}`.trim();
  }

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeDifference(date, time));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeDifference(date, time));
    }, 1000);

    return () => clearInterval(interval);
  }, [date, time]);
  const matchStarted = timeRemaining === "Match Ongoing" || timeRemaining === "Match Ended";

  return (
    <nav className="bg-gray-800 text-white flex justify-between items-center px-4 py-2 shadow-lg">
      {/* Player One */}
      <div className="text-center">
        <span className="block text-sm md:text-lg font-semibold">
          {playerOneUsername}
        </span>
      </div>
      {/* Score Section */}
      {matchStarted ? (
        <div className="flex items-center justify-center space-x-4 md:space-x-12">
          <span className="block text-lg md:text-2xl font-bold text-yellow-400">
            {playerOneScore}
          </span>
          <span className="text-lg md:text-3xl font-bold text-gray-400">VS</span>
          <span className="block text-lg md:text-2xl font-bold text-blue-400">
            {playerTwoScore}
          </span>
        </div>
      ) : (
        <div className="text-center">
          <span className="block text-lg md:text-2xl font-bold text-white">
            {timeRemaining}
          </span>
        </div>
      )}
      {/* Player Two */}
      <div className="text-center">
        <span className="block text-sm md:text-lg font-semibold">
          {playerTwoUsername}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
