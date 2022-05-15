import { Move } from 'chess.ts';

const MoveList: React.FC<{ moves: Move[] }> = ({ moves }) => {
  let moveStrings: (String | undefined)[][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    moveStrings.push([moves[i]?.san, moves[i + 1]?.san]);
  }

  return (
    <div className="bg-gray-600 w-96 max-h-min">
      {moveStrings.map(
        (moveStrings: (String | undefined)[], index): JSX.Element => {
          const check = [
            index % 2 === 0 ? 'bg-gray-700' : '',
            index % 2 === 0 ? '' : 'bg-gray-700',
          ];
          return (
            <div key={`${index}-container`} className="flex justify-between">
              <div
                className={`p-4 text-xl w-16 font-bold text-center ${check[0]}`}
                key={`${index}-num`}
              >
                {index}.
              </div>
              <div
                className={`p-4 text-xl flex-1 text-center ${check[1]}`}
                key={`${index}-move-white`}
              >
                {moveStrings[0]}
              </div>
              <div
                className={`p-4 text-xl flex-1 text-center ${check[0]} ${
                  moveStrings[1] ? '' : 'bg-gray-800'
                }`}
                key={`${index}-move-black`}
              >
                {moveStrings[1]}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default MoveList;
