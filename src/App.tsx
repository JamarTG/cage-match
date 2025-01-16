import { useState, useEffect } from "react";
import "./App.css";
import { PlayerDetails } from "./types/interfaces";
import ViewMatch from "./components/ViewMatch";
import ReactTwitchEmbedVideo from "react-twitch-embed-video";
import { useMediaQuery } from "react-responsive";
import { ClipLoader } from "react-spinners";

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
  const [loading, setLoading] = useState(true);

  const match = {
    date: new Date("2025-01-15T10:00:00.000Z").toLocaleDateString(),
    time: "9:32 AM",
    player1Username: "daddystrength",
    player2Username: "CrazySage",
  };

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <ClipLoader size={150} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <div className={`justify-between flex flex-col justify-center items-center md:flex-row w-full ${isLargeScreen ? "h-full" : ""}`}>
          <div className="flex flex-col justify-start items-center md:flex-row h-full w-full">
            <ReactTwitchEmbedVideo
              channel={"masterglaves"}
              chat="mobile"
              width="100%"
              height={isLargeScreen ? "100%" : "1000px"} // Adjust height for larger screens
              chatWidth="500px"
            />
          </div>
          <ViewMatch
            match={match}
            player1Details={player1Details}
            player2Details={player2Details}
            setPlayer1Details={setPlayer1Details}
            setPlayer2Details={setPlayer2Details}
          />
        </div>
      )}
    </div>
  );
}

export default App;
