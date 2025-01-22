import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import upcomingMatches from "../upcoming.json";
import playerinfo from "../playerinfo";

Modal.setAppElement("#root");

const UpcomingMatches: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});
  const [info, setInfo] = useState<{
    [key: string]: {
      rating: number;
      title: string | null;
      ratingIsProvisional: boolean;
    };
  }>({});

  useEffect(() => {
    console.log( "upcomingMatches", upcomingMatches.matches);
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

  const fetchPlayerInfo = async (player: string) => {
    try {
      const response = await fetch(`https://lichess.org/api/user/${player}`);
      const data = await response.json();
      const rating = data.perfs ? data.perfs.blitz.rating : null;
      const title = data.title ? data.title : null;
      const ratingIsProvisional = data.perfs?.blitz.provisional || false;
      return { rating, title, ratingIsProvisional };
    } catch (error) {
      console.error(`Error fetching rating for ${player}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const newInfos: {
        [key: string]: {
          title: string | null;
          rating: number;
          ratingIsProvisional: boolean;
        };
      } = {};
      for (const match of matches) {
        const player1Info = await fetchPlayerInfo(match.player1);
        const player2Info = await fetchPlayerInfo(match.player2);
        if (player1Info !== null) newInfos[match.player1] = player1Info;
        if (player2Info !== null) newInfos[match.player2] = player2Info;
      }
      setInfo(newInfos);
    };

    if (matches.length > 0) {
      fetchInfo();
    }
  }, [matches]);

  const sortedMatches = matches.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  
  

  const now = new Date();
  console.log(sortedMatches)
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
  
  console.log("match", upcomingMatch);

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
              <h2 className="flex gap-2 text-2xl m-2 font-bold text-center lg:text-left">
                <p className="text-orange-500">
                  {info[upcomingMatch.player1]?.title}{" "}
                </p>
                {playerinfo[upcomingMatch.player1.toLocaleLowerCase()].name ??
                  "Unknown Player"}{" "}
              </h2>
              <img
                src={`/${
                  playerinfo[upcomingMatch.player1.toLocaleLowerCase()].image
                }`}
                alt={`${upcomingMatch.player1}'s avatar`}
                onError={(e) => (e.currentTarget.src = "/default.jpg")}
                className="hidden lg:block w-32 h-32 lg:w-64 lg:h-64 border-4 border-indigo-600"
              />
              <a
                href={`https://lichess.org/@/${upcomingMatch.player1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 flex gap-2 text-lg lg:text-2xl font-semibold"
              >
                {upcomingMatch.player1}{" "}
                <p className="text-gray-200 w-16 text-md flex justify-center items-center">
                 
                  {info[upcomingMatch.player1]?.rating ?? "    "}
                  {info[upcomingMatch.player1]?.ratingIsProvisional && (
                    <span>?</span>
                  )}
                </p>
              </a>
            </div>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-indigo-600 lg:mx-6">
            VS
          </p>
          <div className="flex flex-col items-center space-x-3">
            <h2 className="flex gap-2 text-2xl m-2 font-bold text-center lg:text-left">
              <p className="text-orange-500">
                {info[upcomingMatch.player2]?.title}{" "}
              </p>
              {playerinfo[upcomingMatch.player2.toLocaleLowerCase()].name ??
                "Unknown Player"}{" "}
            </h2>
            <img
              src={`/${
                playerinfo[upcomingMatch.player2.toLocaleLowerCase()].image
              }`}
              alt={`${upcomingMatch.player2}'s avatar`}
              onError={(e) => (e.currentTarget.src = "/default.jpg")}
              className="hidden lg:block w-32 h-32 lg:w-64 lg:h-64 border-4 border-indigo-600"
            />
            <a
                href={`https://lichess.org/@/${upcomingMatch.player2}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 flex gap-2 text-lg lg:text-2xl font-semibold"
              >
                {upcomingMatch.player2}{" "}
                <p className="text-gray-200 w-16 text-md flex justify-center items-center">
                 
                  {info[upcomingMatch.player2]?.rating ?? "    "}
                  {info[upcomingMatch.player2]?.ratingIsProvisional && (
                    <span>?</span>
                  )}
                </p>
              </a>
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
