import type { FormEvent } from 'react';
import { useState, useCallback } from 'react';
import { useGameOfLife, useInterval } from '../../hooks';
import type { Boundary } from '../../hooks';

type GridSizes = 10 | 25 | 50;

export const Grid = (): JSX.Element => {
  const [play, setPlay] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [gameOfLifeState, gameOfLifeDispatch] = useGameOfLife(10, 10, 'hard');

  const getGridStyle = useCallback((gridSize) => {
    switch (gridSize) {
      case 10:
        return 'grid-cols-10';
      case 25:
        return 'grid-cols-25';
      case 50:
        return 'grid-cols-50';
      default:
        return 'grid-cols-10';
    }
  }, []);

  useInterval(() => {
    if (play) {
      gameOfLifeDispatch({ type: 'nextGeneration' });
    }
  }, timer);

  const handleTimerUpdate = useCallback((e: FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    setTimer(() => Number.parseInt(target.value, 10));
  }, []);

  const handleCheckboxUpdate = useCallback((e: FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    setShowGrid(target.checked);
  }, []);

  const handleGridSizeDropdownUpdate = useCallback(
    (e: FormEvent<EventTarget>) => {
      const target = e.target as HTMLInputElement;
      const gridSize = Number.parseInt(target.value, 10) as GridSizes;
      gameOfLifeDispatch({
        type: 'updateGridSize',
        payload: { numOfRows: gridSize, numOfColumns: gridSize },
      });
    },
    [gameOfLifeDispatch],
  );

  const handleBoundaryDropdownUpdate = useCallback(
    (e: FormEvent<EventTarget>) => {
      const target = e.target as HTMLInputElement;
      gameOfLifeDispatch({
        type: 'updateGridBoundary',
        payload: { newBoundary: target.value as Boundary },
      });
    },
    [gameOfLifeDispatch],
  );

  return (
    <>
      <div
        className={mergeClassNames('mx-auto grid w-fit', getGridStyle(gameOfLifeState.grid.length))}
      >
        {gameOfLifeState.grid.map((arr, i) =>
          arr.map((cellState, j) => (
            <button
              className={mergeClassNames(
                'border-1 h-4 w-4 border-black',
                cellState === 1 ? 'bg-black' : 'bg-white',
                showGrid ? 'border-[0.25px]' : 'border-0',
              )}
              type="button"
              // There is no possible unique key
              // eslint-disable-next-line react/no-array-index-key
              key={`cell ${i}${j}}`}
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
      <div className="mt-2">
        <button
          className="mx-2 rounded border-2 border-black bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={(): void => gameOfLifeDispatch({ type: 'nextGeneration' })}
        >
          Next generation
        </button>
        <button
          className={mergeClassNames(
            'mx-2 rounded border-2 border-black py-2 px-4 font-bold text-white',
            play ? 'bg-slate-500' : 'bg-blue-500 hover:bg-blue-700',
          )}
          type="button"
          onClick={(): void => setPlay(() => !play)}
        >
          {play ? 'Pause' : 'Play'}
        </button>
        <button
          className="mx-2 rounded border-2 border-black bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          type="button"
          onClick={(): void => gameOfLifeDispatch({ type: 'clearGrid' })}
        >
          Clear Grid
        </button>
        <label htmlFor="timer" className="rounded p-2">
          In milliseconds:&nbsp;{' '}
          <input
            className="w-20 rounded p-2"
            type="number"
            min="10"
            step="10"
            id="timer"
            value={timer}
            onChange={handleTimerUpdate}
            disabled={play}
          />
        </label>
        <label htmlFor="showGrid">
          Show Grid:&nbsp;
          <input type="checkbox" id="showGrid" onChange={handleCheckboxUpdate} />
        </label>

        <label htmlFor="gridSelect" className="mx-2">
          Grid Size:&nbsp;
          <select
            id="gridSelect"
            className="rounded p-2"
            onChange={handleGridSizeDropdownUpdate}
            disabled={play}
          >
            <option value="10">10x10</option>
            <option value="25">25x25</option>
            <option value="50">50x50</option>
          </select>
        </label>
        <label htmlFor="boundary" className="mx-2">
          Boundary:&nbsp;
          <select
            id="boundary"
            className="rounded p-2"
            onChange={handleBoundaryDropdownUpdate}
            disabled={play}
          >
            <option value="hard">Hard</option>
            <option value="torus">Torus</option>
            <option value="kleinBottle">Klein Bottle</option>
            <option value="projectivePlane">Projective Plane</option>
          </select>
        </label>
      </div>
    </>
  );
};

function mergeClassNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}
