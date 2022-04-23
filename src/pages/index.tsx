import type { NextPage } from 'next';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.ts';
import { useState } from 'react';
import { PartialMove, Piece, Square } from 'chess.ts/dist/types';


const Home: NextPage = () => {
  const [game, setGame] = useState(new Chess());

  const doStep = (move: PartialMove) => {
    // We already verified that the move was valid
    setGame((g: Chess) => {
      const newGame = new Chess(g.fen());
      newGame.move(move);
      const moves = newGame.moves();
      newGame.move(moves[Math.floor(Math.random() * moves.length)]);
      return newGame;
    });
  }

  const onDrop = (sourceSquare: Square, targetSquare: Square, _: Piece) => {
    const pmove = {
      from: sourceSquare,
      to: targetSquare,
    } as PartialMove;
    // Seems like we need to validate the move by using a new object...
    const testGame = new Chess(game.fen());
    if (testGame.move(pmove)) {
      doStep(pmove);
      return true;
    }
  }

  return (
    <>
        <div className="pt-4 text-xl text-center">
            TcTrainer
        </div>

        <div className="flex justify-center pt-4">
            <Chessboard position={game.fen()} onPieceDrop={onDrop}></Chessboard>
        </div>
    </>
  );
};

export default Home;
