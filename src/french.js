const fetchMatches = async () => {
  try {
    const url = new URL(`https://lichess.org/api/games/user/daddystrength`);
    url.searchParams.append("opening", "French Defense");
    url.searchParams.append("max", 20);
  

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

    // const frenchDefenceGames = games.filter(game => game.opening?.name.includes("French Defense"));
    console.log(games);
    // return frenchDefenceGames;
  } catch (error) {
    console.error(`Error fetching games: ${error}`);
  }
};

fetchMatches();
