import * as trpc from '@trpc/server';
import { z } from 'zod';
import axios from 'axios';
import { randomIndex } from '@/utils/utilFunctions';

type MastersResponseMove = {
  uci: string,
  san: string,
  averageRating: number,
  white: number,
  draws: number,
  black: number,
  game: null
};

type MastersResponse = {
  white: number,
  black: number,
  draw: number,
  moves: MastersResponseMove[],
  topGames: MastersResponseGame[],
  opening: string,
};

type MastersResponseGame = {
  uci: string,
  san: string,
  averageRating: number,
  white: number,
  draws: number,
  black: number,
  game: null,
};

export const appRouter = trpc
  .router()
  .query('getBookMove', {
    input: z.object({ play: z.string() }),
    async resolve({ input }) {
      const lichessResponse = await axios.get<MastersResponse>('masters', {
        baseURL: 'https://explorer.lichess.ovh',
        headers: {
          'Authorization': `Bearer ${process.env.LICHESS_API_KEY}`,
        },
        params: {
          play: input.play,
          since: 1952,
          moves: 12,
          topGames: 0,
        },
      }).catch(e => console.log(e));

      if (lichessResponse) {
        const resData = lichessResponse.data as MastersResponse;

        if (resData.moves.length > 0) {
          return {
            res: resData.moves[randomIndex(resData.moves)].san,
          };
        }
      }
      return { res: '' };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
