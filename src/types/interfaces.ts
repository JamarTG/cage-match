export interface PlayerDetails {
  rating: number | null;
  flair: string | null;
  url: string | null;
  title: string | null;
  prov: boolean;
  username: string;
}

export interface Match {
    date: string,
    time: string,
    player1Username: string,
    player2Username: string,
  };