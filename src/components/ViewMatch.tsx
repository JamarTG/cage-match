// import React, { useEffect, useState } from "react";
// import realNamesData from "../data/realNames.json";
import PlayerInfo from "./PlayerInfo";
import { Match } from "./Store";
import { PlayerDetails } from "../types/interfaces";
import { useEffect } from "react";
interface ViewMatchProps {
  match: Match;
  player1Details: PlayerDetails;
  player2Details: PlayerDetails;
  setPlayer1Details: React.Dispatch<React.SetStateAction<PlayerDetails>>;
  setPlayer2Details: React.Dispatch<React.SetStateAction<PlayerDetails>>;
}

const ViewMatch: React.FC<ViewMatchProps> = ({
  match,
  player1Details,
  player2Details,
  setPlayer1Details,
  setPlayer2Details,
}) => {
  const fetchPlayerDetails = async (
    username: string
  ): Promise<PlayerDetails> => {
    const storedData = localStorage.getItem(`playerDetails_${username}`);
    const storedTime = localStorage.getItem(`playerDetailsTime_${username}`);
    const oneHour = 60 * 60 * 1000;

    if (
      storedData &&
      storedTime &&
      new Date().getTime() - parseInt(storedTime) < oneHour
    ) {
      return JSON.parse(storedData);
    }

    try {
      console.log("request was made");
      const response = await fetch(`https://lichess.org/api/user/${username}`);
      const data = await response.json();

      const playerDetails: PlayerDetails = {
        username,
        rating: data.perfs.blitz.rating,
        flair: data.flair || null,
        url: data.url,
        title: data.title || null,
        prov: data.perfs.blitz.prov ?? false,
      };

      localStorage.setItem(
        `playerDetails_${username}`,
        JSON.stringify(playerDetails)
      );
      localStorage.setItem(
        `playerDetailsTime_${username}`,
        new Date().getTime().toString()
      );

      return playerDetails;
    } catch (error) {
      console.error("Error fetching player details:", error);
      return {
        username,
        rating: null,
        flair: null,
        url: null,
        title: null,
        prov: false,
      };
    }
  };

  // const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const fetchDetails = async () => {
      const details1 = await fetchPlayerDetails(match.player1Username);
      const details2 = await fetchPlayerDetails(match.player2Username);
      setPlayer1Details(details1);
      setPlayer2Details(details2);
    };

    fetchDetails();
  }, [match.player1Username, match.player2Username]);

  // function calculateTimeDifference(date: string, time: string) {
  //   if (!time) return "";

  //   const [timePart, modifier] = time.split(" ");
  //   let [hours, minutes] = timePart.split(":").map(Number);
  //   if (modifier === "PM" && hours !== 12) hours += 12;
  //   if (modifier === "AM" && hours === 12) hours = 0;

  //   const matchDateTime = new Date(date);
  //   matchDateTime.setHours(hours, minutes, 0, 0);
  //   const now = new Date();
  //   const diffInSeconds = Math.round(
  //     (matchDateTime.getTime() - now.getTime()) / 1000
  //   );
  //   const diffInMinutes = Math.floor(diffInSeconds / 60);
  //   const remainingSeconds = diffInSeconds % 60;
  //   const diffInHours = Math.floor(diffInMinutes / 60);
  //   const remainingMinutes = diffInMinutes % 60;

  //   if (diffInSeconds <= 0) {
  //     if (diffInHours <= -3) {
  //       return "Match ended";
  //     }
  //     return "Match Ongoing";
  //   }

  //   const hoursDisplay = diffInHours > 0 ? `${diffInHours}h ` : "";
  //   const minutesDisplay = remainingMinutes > 0 ? `${remainingMinutes}m ` : "";
  //   const secondsDisplay = `${remainingSeconds}s`;

  //   return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`.trim();
  // }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // setTimeRemaining(calculateTimeDifference(match.date, match.time));
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [match.date, match.time]);

  return (
    <div className="flex flex-col md:flex-row h-4/5 w-full">
      <PlayerInfo
        match={match}
        players={[player1Details, player2Details]}
        scores={[0, 0]}
      />
    </div>
  );
};

export default ViewMatch;
