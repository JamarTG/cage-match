import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import upcomingMatches from "../upcoming.json";
import playerinfo from "../playerinfo";

Modal.setAppElement("#root");

const UpcomingMatches: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setMatches(upcomingMatches.matches);
  }, []);

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: { [key: string]: string } = {};
      matches.forEach((match, index) => {
        const matchDate = new Date(match.date);
        const timeRemaining = matchDate.getTime() - new Date().getTime();
        if (timeRemaining > 0) {
          const hours = Math.floor(timeRemaining / 1000 / 60 / 60);
          const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
          const seconds = Math.floor((timeRemaining / 1000) % 60);
          newCountdowns[index] = `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        } else {
          newCountdowns[index] = "Match Started";
        }
      });
      setCountdowns(newCountdowns);
    };

    const interval = setInterval(updateCountdowns, 1000);
    updateCountdowns();

    return () => clearInterval(interval);
  }, [matches]);

  const sortedMatches = matches.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const now = new Date();
  const upcomingMatch = sortedMatches.find((match) => {
    const convertToDate = (dateString: string): Date => {
      const [datePart, timePart] = dateString.split(" ");
      const [year, month, day] = datePart.split("-");
      const [hour, minute] = timePart.split(":");
      const isPM = timePart.includes("PM");
      const hour24 = isPM ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12;
      return new Date(
        `${year}-${month}-${day}T${String(hour24).padStart(
          2,
          "0"
        )}:${minute}:00`
      );
    };

    const matchDate = convertToDate(match.date);
    return matchDate > now;
  });

  if (!upcomingMatch) {
    return (
      <div
        style={{ height: "80vh" }}
        className="bg p-6 rounded-lg shadow-lg space-y-6 text-white flex items-center justify-center"
      >
        <p className="text-gray-500 text-center">No upcoming matches.</p>
      </div>
    );
  }

  return (
    <div
      style={{ height: "80vh" }}
      className="bg p-6 rounded-lg space-y-6 text-white"
    >
      <div>
        <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-6 space-y-6 lg:space-y-0">
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6">
            <div className="flex flex-col items-center space-x-3">
              <h2 className="text-2xl m-2 font-bold text-center lg:text-left">
                {playerinfo[upcomingMatch.player1.toLocaleLowerCase()].name ??
                  "Unknown Player"}
              </h2>
              <img
                src={`/${playerinfo[upcomingMatch.player1.toLocaleLowerCase()].image}`}
                alt={`${upcomingMatch.player1}'s avatar`}
                onError={(e) => (e.currentTarget.src = "/default.jpg")}
                className="hidden lg:block w-32 h-32 lg:w-64 lg:h-64 border-4 border-indigo-600"
              />
              <div className="flex flex-row bg-red-"></div>
              <a
                href={`https://lichess.org/@/${upcomingMatch.player1}`}
                target="_blank"
                rel="noopener noreferrer"
                className=" text-blue-500 text-lg lg:text-2xl font-semibold"
              >
                {upcomingMatch.player1}
              </a>
            </div>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-indigo-600 lg:mx-6">
            VS
          </p>
          <div className="flex flex-col items-center space-x-3">
            <h2 className="text-2xl m-2 font-bold">
              {playerinfo[upcomingMatch.player2.toLocaleLowerCase()].name ??
                "Unknown Player"}
            </h2>
            <img
              src={`/${playerinfo[upcomingMatch.player2.toLocaleLowerCase()].image}`}
              alt={`${upcomingMatch.player2}'s avatar`}
              onError={(e) => (e.currentTarget.src = "/default.jpg")}
              className="hidden lg:block w-32 h-32 lg:w-64 lg:h-64 border-4 border-indigo-600"
            />
            <div>
              <a
                href={`https://lichess.org/@/${upcomingMatch.player2}`}
                target="_blank"
                rel="noopener noreferrer"
                className=" text-blue-500 text-lg lg:text-2xl font-semibold"
              >
                {upcomingMatch.player2}
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6">
          <div className="flex space-x-2">
            <span className="text-xl">
              {new Date(upcomingMatch.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>

            <span className="text-xl">
              -{" "}
              {new Date(upcomingMatch.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="icon text-3xl">&#xe008;</span>
            <span className="text-xl">3+2 Blitz | 1st to 7 Wins</span>
          </div>
          <div className="text-7xl lg:text-8xl font-bold text-white mt-4">
            <span className="text-4xl">
              {countdowns[matches.indexOf(upcomingMatch)]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMatches;
