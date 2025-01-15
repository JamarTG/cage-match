import { Chess } from "chess.js";
import { Dispatch, SetStateAction } from "react";

export const updateChessInstance = (index: number, moveIndex: number, setChessInstances: Dispatch<SetStateAction<Chess[]>>, games: any[]) => {
    const chess = new Chess();
    const moves = games[index].moves.split(" ").slice(0, moveIndex);
    moves.forEach((move: string) => chess.move(move));
    setChessInstances((prevInstances) => {
      const newInstances = [...prevInstances];
      newInstances[index] = chess;
      return newInstances;
    });
  };