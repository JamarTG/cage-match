import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const fetchMatches = async (player1, player2, date) => {
  try {
    const { since, until } = getLichessTimestamps(date);
    console.log(
      `Fetching games from ${new Date(
        since * 1000
      ).toLocaleString()} to ${new Date(until * 1000).toLocaleString()}`
    );

    const url = new URL(`https://lichess.org/api/games/user/${player1}`);
    url.searchParams.append("vs", player2);
    url.searchParams.append("since", since);
    url.searchParams.append("until", until);
    url.searchParams.append("max", 20);
    url.searchParams.append("sort", "dateAsc"); // Fetch games in descending order

    const response = await fetch(url, {
      headers: {
        Accept: "application/x-ndjson",
      },
    });

    if (!response.ok) {
      console.error(`Error ${response.status}: ${response.statusText}`);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let games = [];

    while (true) {
      if (!reader) throw new Error("Reader is undefined");
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);
      for (const line of lines) {
        const game = JSON.parse(line);
        games.push(game);
      }
    }

    console.log(games.length);
    return games;
  } catch (error) {
    console.error(`Error fetching games: ${error}`);
  }
};

const match = {
  player1: "pawnmatedpcm",
  player2: "theslayertoken456",
  date: "2025-01-17 5:30PM", // Jamaican time (UTC -5)
};

const matchId = `${match.player1}_vs_${match.player2}_${match.date
  .split(" ")[0]
  .replace(/[\s:]/g, "_")}`;

function getLichessTimestamps(inputTime) {
  const jamaicanOffset = "-05:00";
  const formattedInput = inputTime.replace(
    /(\d{4}-\d{2}-\d{2}) (\d{1,2}:\d{2})([APM]+)/,
    (match, date, time, period) => {
      let [hour, minute] = time.split(":");
      if (period === "PM" && hour < 12) {
        hour = parseInt(hour) + 12;
      } else if (period === "AM" && hour === "12") {
        hour = "00";
      }
      return `${date}T${hour}:${minute}:00.000${jamaicanOffset}`;
    }
  );

  const jamaicanDate = new Date(formattedInput);
  const since = jamaicanDate.getTime();
  const until = since + 4 * 60 * 60 * 1000;

  return { since, until };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saveMatchesToFile = (matchId, games) => {
  const filePath = path.join(__dirname, "matches.json");
  let matches = {};

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    matches = JSON.parse(fileContent);
  }

  matches[matchId] = games;

  fs.writeFileSync(filePath, JSON.stringify(matches, null, 2), "utf-8");
};

fetchMatches(match.player1, match.player2, match.date).then((games) => {
  saveMatchesToFile(matchId, games);
});
