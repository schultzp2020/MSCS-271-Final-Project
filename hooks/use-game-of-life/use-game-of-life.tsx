import type { Reducer, Dispatch } from 'react';
import { useReducer, useMemo } from 'react';

export interface GameOfLifeState {
  grid: (0 | 1)[][];
}

export type GameOfLifeActionKind = 'nextGeneration' | 'updateCell' | 'updateGrid';

interface UpdateCellPayload {
  row: number;
  column: number;
  cellState: 0 | 1;
}

interface UpdateGridPayload {
  newGrid: (0 | 1)[][];
}

export type GameOfLifeActionPayload = UpdateCellPayload | UpdateGridPayload;

interface GameOfLifeActionNextGeneration {
  type: 'nextGeneration';
  payload?: never;
}

interface GameOfLifeActionUpdateCell {
  type: 'updateCell';
  payload: UpdateCellPayload;
}

interface GameOfLifeActionUpdateGrid {
  type: 'updateGrid';
  payload: UpdateGridPayload;
}

export type GameOfLifeAction =
  | GameOfLifeActionNextGeneration
  | GameOfLifeActionUpdateCell
  | GameOfLifeActionUpdateGrid;

export type UseGameOfLife = [GameOfLifeState, Dispatch<GameOfLifeAction>];

export const useGameOfLife = (numOfRows: number, numOfColumns: number): UseGameOfLife => {
  const grid = useMemo(() => {
    const g: (0 | 1)[][] = [];

    for (let i = 0; i < numOfRows; i += 1) {
      g.push(new Array<0 | 1>(numOfColumns).fill(0));
    }

    return g;
  }, [numOfRows, numOfColumns]);

  const [gameOfLifeState, gameOfLifeDispatch] = useReducer<
  Reducer<GameOfLifeState, GameOfLifeAction>
  >(gameOfLifeReducer, { grid });

  return [gameOfLifeState, gameOfLifeDispatch];
};

const gameOfLifeReducer = (state: GameOfLifeState, action: GameOfLifeAction): GameOfLifeState => {
  const { grid } = state;
  const { type, payload } = action;

  if (type === 'nextGeneration') {
    const newGrid: (0 | 1)[][] = grid.map((arr) => arr.map(() => 0));

    for (let l = 0; l < newGrid.length; l += 1) {
      for (let m = 0; m < newGrid[l].length; m += 1) {
        // finds alive neighbors
        let aliveNeighbors = 0;
        for (let i = -1; i < 2; i += 1) {
          for (let j = -1; j < 2; j += 1) {
            if (l + i >= 0 && l + i < newGrid.length && m + j >= 0 && m + j < newGrid[l].length) {
              aliveNeighbors += grid[l + i][m + j];
            }
          }
        }

        // the cell needs to be subtracted from its neighbors as it was counted before
        aliveNeighbors -= grid[l][m];

        // game of life rules
        if (grid[l][m] === 1 && aliveNeighbors < 2) {
          // the cell is lonely and dies
          newGrid[l][m] = 0;
        } else if (grid[l][m] === 1 && aliveNeighbors > 3) {
          // the cell dies due to over population
          newGrid[l][m] = 0;
        } else if (grid[l][m] === 0 && aliveNeighbors === 3) {
          // a new cell is born
          newGrid[l][m] = 1;
        } else {
          // remains the same
          newGrid[l][m] = grid[l][m];
        }
      }
    }

    return { grid: newGrid };
  }

  if (type === 'updateCell') {
    const { row, column, cellState } = payload;
    grid[row][column] = cellState;

    return { grid };
  }

  if (type === 'updateGrid') {
    const { newGrid } = payload;

    return { grid: newGrid };
  }

  return state;
};
