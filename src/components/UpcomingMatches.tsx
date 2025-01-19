import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Close } from "./svg/Close";
import upcomingMatches from "../upcomingMatches.json";

Modal.setAppElement("#root");

const UpcomingMatches: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          newCountdowns[index] = `${String(hours).padStart(
            2,
            "0"
          )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
          )}`;
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
      return new Date(`${year}-${month}-${day}T${String(hour24).padStart(2, "0")}:${minute}:00`);
    };

    const matchDate = convertToDate(match.date);
    return matchDate > now;
    return matchDate > now;
  });
  
  console.log

  if (!upcomingMatch) {
    return <p className="text-gray-500 text-center">No upcoming matches.</p>;
  }

  return (
    <div className="text-white p-6 lg:p-8 rounded-lg shadow-lg space-y-8">
      {/* Main Match */}
      <div className="bg flex flex-col justify-center items-center p-6 lg:p-8 rounded-lg shadow-2xl transform hover:scale-105 transition duration-300 space-y-6 relative">
        {/* Button to open modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 bg-indigo-600 text-white p-2 rounded-lg"
        >
          View Other Upcoming Matches
        </button>
        <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-6 space-y-6 lg:space-y-0">
          <div className="flex flex-col items-center space-x-3">
            <img
              src={`/${upcomingMatch.player1}.jpg`}
              alt={`${upcomingMatch.player1}'s avatar`}
              onError={(e) => (e.currentTarget.src = "/default.jpg")}
              className="w-48 h-48 lg:w-96 lg:h-96 border-4 border-indigo-600"
            />
            <div className="flex flex-row bg-red-">
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
            <img
              src={`/${upcomingMatch.player2}.jpg`}
              alt={`${upcomingMatch.player2}'s avatar`}
              onError={(e) => (e.currentTarget.src = "/default.jpg")}
              className="w-48 h-48 lg:w-96 lg:h-96 border-4 border-indigo-600"
            />
            <div>
              <a
                href={`https://lichess.org/@/${upcomingMatch.player2}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg lg:text-2xl font-semibold"
              >
                {upcomingMatch.player2}
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">Date:</span>
            <span className="text-xl">
              {new Date(upcomingMatch.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">Time:</span>
            <span className="text-xl">
              {new Date(upcomingMatch.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">Format:</span>
            <span className="text-xl">3+2 Blitz | 1st to 7 Wins</span>
          </div>
        </div>
        <div className="text-7xl lg:text-8xl font-bold text-white mt-4">
          <span className="text-6xl">{countdowns[matches.indexOf(upcomingMatch)]}</span>
        </div>
      </div>
      {/* Modal for other matches */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Other Upcoming Matches"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        overlayClassName=""
      >
        <div className="relative bg-gray-800 p-6 rounded-lg w-11/12 max-w-lg">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-2 right-2 text-white p-2 rounded-full"
          >
            <Close className="text-3xl" />
          </button>
          <div className="space-y-6">
            {sortedMatches.slice(1).map((match, index) => (
              <div
                key={index}
                className="text-white p-4 rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div>
                      <a
                        href={`https://lichess.org/@/${match.player1}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-md lg:text-lg font-medium"
                      >
                        {match.player1}
                      </a>
                    </div>
                  </div>
                  <p className="text-lg lg:text-xl font-semibold text-indigo-500 lg:mx-4">
                    VS
                  </p>
                  <div className="flex items-center space-x-2">
                    <div>
                      <a
                        href={`https://lichess.org/@/${match.player2}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-md lg:text-lg font-medium"
                      >
                        {match.player2}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between text-xs lg:text-sm text-gray-400 mt-3">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Date:</span>
                    <span>{new Date(match.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Time:</span>
                    <span>{new Date(match.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Format:</span>
                    <span>3+2 Blitz | 1st to 7 Wins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpcomingMatches;
