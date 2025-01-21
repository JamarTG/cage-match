import React, { useEffect} from "react";
import PlayerInfo from "./PlayerInfo";
import { Match } from "./Store";
import { PlayerDetails } from "../types/interfaces";

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



  useEffect(() => {
    const fetchDetails = async () => {
      const details1 = await fetchPlayerDetails(match.player1Username);
      const details2 = await fetchPlayerDetails(match.player2Username);
      setPlayer1Details(details1);
      setPlayer2Details(details2);
    };

    fetchDetails();
  }, [match.player1Username, match.player2Username]);


  return (
    <div className="flex flex-col h-4/5 w-full p-4 rounded-lg shadow-md">
      <PlayerInfo
        match={match}
        players={[player1Details, player2Details]}
        scores={[0, 0]}
      />

    </div>
  );
};

export default ViewMatch;
