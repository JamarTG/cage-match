import { useState } from "react";
import "./App.css";
import { PlayerDetails } from "./types/interfaces";
import ViewMatch from "./components/ViewMatch";
import ReactTwitchEmbedVideo from "react-twitch-embed-video";

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
    date: new Date("2025-01-15T10:00:00.000Z").toLocaleDateString(),
    time: "9:32 AM",
    player1Username: "daddystrength",
    player2Username: "JamariTheGreat",
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <ReactTwitchEmbedVideo channel={"lefonghua"} chat="mobile" />

      <ViewMatch
      match={match}
      player1Details={player1Details}
      player2Details={player2Details}
      setPlayer1Details={setPlayer1Details}
      setPlayer2Details={setPlayer2Details}
      />
    </div>
  );
}

export default App;
