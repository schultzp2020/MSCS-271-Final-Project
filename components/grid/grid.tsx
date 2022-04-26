import type { FormEvent } from 'react';
import { useState, useCallback } from 'react';
import { useGameOfLife, useInterval } from '../../hooks';

export const Grid = (): JSX.Element => {
  const [gameOfLifeState, gameOfLifeDispatch] = useGameOfLife(10, 10);
  const [play, setPlay] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(100);

  useInterval(() => {
    if (play) {
      gameOfLifeDispatch({ type: 'nextGeneration' });
    }
  }, timer);

  const handleChange = useCallback((e: FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    setTimer(() => Number.parseInt(target.value, 10));
  }, []);

  return (
    <>
      <div className="grid grid-cols-10">
        {gameOfLifeState.grid.map((arr, i) =>
          arr.map((cellState, j) => (
            <button
              className={mergeClassNames(
                'h-4 w-4 border-2 border-black',
                cellState === 1 ? 'bg-black' : 'bg-white',
              )}
              type="button"
              aria-label={`cell ${i}${j}}`}
              onClick={(): void =>
                gameOfLifeDispatch({
                  type: 'updateCell',
                  payload: { row: i, column: j, cellState: cellState === 0 ? 1 : 0 },
                })
              }
            />
          )),
        )}
      </div>
      <button
        className="border-2 border-black"
        type="button"
        onClick={(): void => gameOfLifeDispatch({ type: 'nextGeneration' })}
      >
        Next generation
      </button>
      <button
        className={mergeClassNames('border-2 border-black', play ? 'bg-slate-500' : 'bg-inherit')}
        type="button"
        onClick={(): void => setPlay(() => !play)}
      >
        Play/Pause
      </button>
      <label htmlFor="timer">
        In milliseconds:{' '}
        <input
          type="number"
          min="0"
          step="1"
          id="timer"
          value={timer}
          onChange={handleChange}
          disabled={play}
        />
      </label>
    </>
  );
};

function mergeClassNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}
