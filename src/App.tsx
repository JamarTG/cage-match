import { useState } from "react";
import "./App.css";
import { PlayerDetails } from "./types/interfaces";
import ViewMatch from "./components/ViewMatch";
import ReactTwitchEmbedVideo from "react-twitch-embed-video";
import { useMediaQuery } from "react-responsive";
import Navbar from "./components/Navbar";

function App() {
  const [player1Details, setPlayer1Details] = useState<PlayerDetails>({
    rating: null,
    flair: "",
    url: "",
    title: "",
    prov: false,
    username: "",
  });
  const [player2Details, setPlayer2Details] = useState<PlayerDetails>({
    rating: null,
    flair: "",
    url: "",
    title: "",
    prov: false,
    username: "",
  });

  const match = {
    date: new Date("2025-01-19T10:00:00.000Z").toLocaleDateString(),
    time: "10:00 PM",
    player1Username: "daddystrength",
    player2Username: "JamariTheGreat",
  };

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <div className="flex flex-col ">
      <Navbar
        playerOneUsername={player1Details.username}
        playerOneScore={0}
        playerTwoUsername={player2Details.username}
        playerTwoScore={0}
        match={match}
      />
      <div className="flex flex-col items-center h-screen w-screen">
        <div
          className="justify-between flex flex-col justify-center items-center md:flex-row w-full"
          style={{ height: isLargeScreen ? "90%" : "auto" }}
        >
          <div className="flex flex-col px-5 justify-start items-center md:flex-row h-full w-full relative">
            <div className="w-full h-full bg-gray-800 stream-load-bg ">
              <ReactTwitchEmbedVideo
                channel={"masterglaves"}
                chat="mobile"
                width="100%"
                height={isLargeScreen ? "100%" : "1000px"} // Adjust height for larger screens
                chatWidth="500px"
                autoplay
              />
            </div>
          </div>
          <ViewMatch
            match={match}
            player1Details={player1Details}
            player2Details={player2Details}
            setPlayer1Details={setPlayer1Details}
            setPlayer2Details={setPlayer2Details}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
