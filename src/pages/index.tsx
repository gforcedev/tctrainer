import type { NextPage } from 'next';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.ts';
import { useState } from 'react';
import { Move, PartialMove, Piece, Square } from 'chess.ts/dist/types';
import { trpc } from '@/utils/trpc';

const Home: NextPage = () => {
  const [ game, setGame ] = useState(new Chess());
  const trpcClient = trpc.createClient({ url: 'http://localhost:3000/api/trpc' });

  const doStep = async (move: PartialMove) => {
    // We already verified that the inputted move was valid
    // Compute the history here, apply the inputted move as
    // fast as possible, then await the api and apply the response

    let history = game
      .history({ verbose: true })
      .map((m: Move) => `${m.from}${m.to}`)
      .join(',');
    if (history !== '') history += ',';
    history += `${move.from}${move.to}`;

    setGame((g: Chess) => {
      g.move(move);
      return g.clone();
    });

    const nextMove = await trpcClient.query('getBookMove', { play: history });

    if (nextMove.res !== '') {
      setGame ((g: Chess) => {
        g.move(nextMove.res);
        return g.clone();
      });
    } else {
      alert('Out of theory!');
    }
  }

  const onDrop = (sourceSquare: Square, targetSquare: Square, _: Piece) => {
    const pmove = {
      from: sourceSquare,
      to: targetSquare,
    } as PartialMove;
    // Seems like we need to validate the move by using a new object...
    if (game.validateMoves([pmove as Move])) {
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
        <Chessboard
          /*
          // @ts-ignore */
          position={game.fen()} onPieceDrop={onDrop}></Chessboard>
      </div>
    </>
  );
};

export default Home;
