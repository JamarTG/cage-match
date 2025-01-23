import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import upcomingMatches from "../upcoming.json";
import playerinfo from "../playerinfo";
import { Twitch } from "./svg/Twitch";
import { FlagJamaica } from "./svg/countries/Jamaica";
import { FlagUganda } from "./svg/countries/Uganda";
import playerInfo from "../playerinfo";

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
    setMatches(upcomingMatches.matches);
  }, []);

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: { [key: string]: string } = {};
      matches.forEach((match, index) => {
        const matchDate = new Date(match.date);
        const timeRemaining = matchDate.getTime() - new Date().getTime();

        if (timeRemaining > 0) {
          const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
          const seconds = Math.floor((timeRemaining / 1000) % 60);

          const parts = [];
          if (days > 0) parts.push(`${days}d`);
          if (days > 0 || hours > 0) parts.push(`${hours}h`);
          if (days > 0 || hours > 0 || minutes > 0) parts.push(`${minutes}m`);
          parts.push(`${seconds}s`);

          newCountdowns[index] = parts.join(" ");
        } else {
          newCountdowns[index] = "Match Started";
        }
      });

      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const intervalId = setInterval(updateCountdowns, 1000);
    return () => clearInterval(intervalId);
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

  const upcomingMatch = sortedMatches.find((match) => {
    const convertToDate = (dateString: string): Date => {
      const [datePart, timePart] = dateString.split(" ");
      const [year, month, day] = datePart.split("-");
      const [hour, minute] = timePart.split(":");
      const isPM = timePart.toLowerCase().includes("pm");
      const hour24 = isPM ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12;

      // Combine and return as a Date object (assuming input is in UTC-5, adjust as needed)
      return new Date(
        Date.UTC(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day) + 1,
          hour24,
          parseInt(minute)
        )
      );
    };

    const now = new Date(); // Current time in UTC or server-local time
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
        <div className=" flex flex-col lg:flex-row justify-center items-center lg:space-x-6 space-y-6 lg:space-y-0">
          <div className="w-96  flex flex-col  space-x-3">
            <h2 className=" flex justify-start gap-2 text-2xl m-2 font-bold text-center lg:text-left">
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
              className="w-full flex items-end justify-start text-blue-500 flex gap-2 text-lg lg:text-2xl font-semibold"
            >
              {playerInfo[upcomingMatch.player1].flag === "uganda" ? (
                <FlagUganda className="w-6 h-6" />
              ) : (
                <FlagJamaica className="w-6 h-6" />
              )}
              {upcomingMatch.player1}{" "}
              <p className="text-gray-200 w-16 text-md flex justify-center items-center">
                {info[upcomingMatch.player1]?.rating ?? "    "}
                {info[upcomingMatch.player1]?.ratingIsProvisional && (
                  <span>?</span>
                )}
              </p>
            </a>
          </div>

          <p className="text-2xl lg:text-3xl font-bold text-indigo-600 lg:mx-3">
            VS
          </p>
          <div className="w-96  flex items-end flex-col space-x-3">
            <div>
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
                className="w-full flex items-end justify-end text-blue-500 flex gap-2 text-lg lg:text-2xl font-semibold"
              >
                {playerInfo[upcomingMatch.player2].flag === "uganda" ? (
                  <FlagUganda className="w-6 h-6" />
                ) : (
                  <FlagJamaica className="w-6 h-6" />
                )}
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
        </div>
        <div className="flex flex-col items-center mt-6 gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="text-xl flex items-center gap-4">
              <Twitch className="text-2xl" />
              <a
                href="https://www.twitch.tv/masterglaves"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#6441A4" }}
                className="font-bold rounded-xl transition-transform transform hover:scale-105"
              >
                Watch LIVE on Twitch
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg">
                {new Date(upcomingMatch.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <div className="flex justify-center items-center">
                <span className="icon text-3xl">&#xe008;</span>
                <span className="text-lg">3+2 Blitz | 1st to 7 Wins</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-4xl lg:text-5xl font-bold text-white">
            <span className="text-xl lg:text-2xl">
              {countdowns[matches.indexOf(upcomingMatch)]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMatches;
