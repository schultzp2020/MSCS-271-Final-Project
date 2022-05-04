import type { Reducer, Dispatch } from 'react';
import { useReducer } from 'react';

export type Boundary = 'hard' | 'torus' | 'kleinBottle' | 'projectivePlane';

export interface GameOfLifeState {
  grid: (0 | 1)[][];
  boundary: Boundary;
}

interface UpdateCellPayload {
  row: number;
  column: number;
  cellState: 0 | 1;
}

interface UpdateGridPayload {
  newGrid: (0 | 1)[][];
}

interface UpdateGridSizePayload {
  numOfRows: number;
  numOfColumns: number;
}

interface UpdateGridBoundary {
  newBoundary: Boundary;
}

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

interface GameOfLifeActionUpdateGridSize {
  type: 'updateGridSize';
  payload: UpdateGridSizePayload;
}

interface GameOfLifeActionClearGrid {
  type: 'clearGrid';
  payload?: never;
}

interface GameOfLifeActionUpdateGridBoundary {
  type: 'updateGridBoundary';
  payload: UpdateGridBoundary;
}

export type GameOfLifeAction =
  | GameOfLifeActionNextGeneration
  | GameOfLifeActionUpdateCell
  | GameOfLifeActionUpdateGrid
  | GameOfLifeActionUpdateGridSize
  | GameOfLifeActionClearGrid
  | GameOfLifeActionUpdateGridBoundary;

export type UseGameOfLife = [GameOfLifeState, Dispatch<GameOfLifeAction>];

export const useGameOfLife = (
  numOfRows: number,
  numOfColumns: number,
  boundary: Boundary,
): UseGameOfLife => {
  const grid: (0 | 1)[][] = [];

  for (let i = 0; i < numOfRows; i += 1) {
    grid.push(new Array<0 | 1>(numOfColumns).fill(0));
  }

  const [gameOfLifeState, gameOfLifeDispatch] = useReducer<
    Reducer<GameOfLifeState, GameOfLifeAction>
  >(gameOfLifeReducer, { grid, boundary });

  return [gameOfLifeState, gameOfLifeDispatch];
};

const gameOfLifeReducer = (state: GameOfLifeState, action: GameOfLifeAction): GameOfLifeState => {
  const { grid, boundary } = state;
  const { type, payload } = action;

  if (type === 'nextGeneration') {
    const newGrid: (0 | 1)[][] = grid.map((arr) => arr.map(() => 0));

    for (let l = 0; l < newGrid.length; l += 1) {
      for (let m = 0; m < newGrid[l].length; m += 1) {
        // finds alive neighbors
        let aliveNeighbors = 0;

        if (boundary === 'hard') {
          for (let i = -1; i < 2; i += 1) {
            for (let j = -1; j < 2; j += 1) {
              if (l + i >= 0 && l + i < newGrid.length && m + j >= 0 && m + j < newGrid[l].length) {
                // normal interior case
                aliveNeighbors += grid[l + i][m + j];
              }
            }
          }
        }

        if (boundary === 'torus') {
          for (let i = -1; i < 2; i += 1) {
            for (let j = -1; j < 2; j += 1) {
              // normal interior case but loop horizontal and vertical case
              aliveNeighbors += grid[mod(l + i, newGrid.length)][mod(m + j, newGrid[l].length)];
            }
          }
        }

        if (boundary === 'kleinBottle') {
          for (let i = -1; i < 2; i += 1) {
            for (let j = -1; j < 2; j += 1) {
              if (l + i >= 0 && l + i < newGrid.length) {
                // normal interior case
                aliveNeighbors += grid[l + i][mod(m + j, newGrid[l].length)];
              } else {
                // loop horizontal case and swap vertical case
                aliveNeighbors +=
                  grid[mod(l + i, newGrid.length)][
                    mod(newGrid[l].length - m + j - 1, newGrid[l].length)
                  ];
              }
            }
          }
        }

        if (boundary === 'projectivePlane') {
          for (let i = -1; i < 2; i += 1) {
            for (let j = -1; j < 2; j += 1) {
              if (
                (l === 0 || l === newGrid.length - 1) &&
                (m === 0 || m === newGrid[l].length - 1)
              ) {
                // corner case
                if (i === -1 && j === -1) {
                  // map to itself
                  aliveNeighbors += grid[l][m];
                } else if ((i === -1 && j === 0) || (i === 0 && j === -1)) {
                  // map to opposite corner
                  aliveNeighbors +=
                    grid[l === 0 ? newGrid.length - 1 : 0][m === 0 ? newGrid[l].length - 1 : 0];
                } else if (i === 1 && j === -1) {
                  // map to opposite corner adjacent row
                  aliveNeighbors +=
                    grid[l === 0 ? newGrid.length - 2 : 1][m === 0 ? newGrid[l].length - 1 : 0];
                } else if (i === -1 && j === 1) {
                  // map to opposite corner adjacent column
                  aliveNeighbors +=
                    grid[l === 0 ? newGrid.length - 1 : 0][m === 0 ? newGrid[l].length - 2 : 1];
                }
              } else if (
                l + i >= 0 &&
                l + i < newGrid.length &&
                m + j >= 0 &&
                m + j < newGrid[l].length
              ) {
                // normal interior case
                aliveNeighbors += grid[l + i][m + j];
              } else if (
                l + i >= 0 &&
                l + i < newGrid.length &&
                !(m + j >= 0 && m + j < newGrid[l].length)
              ) {
                // swap horizontal case
                aliveNeighbors +=
                  grid[mod(newGrid.length - l + i - 1, newGrid.length)][
                    mod(m + j, newGrid[l].length)
                  ];
              } else if (
                !(l + i >= 0 && l + i < newGrid.length) &&
                m + j >= 0 &&
                m + j < newGrid[l].length
              ) {
                // swap vertical case
                aliveNeighbors +=
                  grid[mod(l + i, newGrid.length)][
                    mod(newGrid[l].length - m + j - 1, newGrid[l].length)
                  ];
              }
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

    return { grid: newGrid, boundary };
  }

  if (type === 'updateCell') {
    const { row, column, cellState } = payload;
    grid[row][column] = cellState;

    return { grid, boundary };
  }

  if (type === 'updateGrid') {
    const { newGrid } = payload;

    return { grid: newGrid, boundary };
  }

  if (type === 'updateGridSize') {
    const { numOfRows, numOfColumns } = payload;

    const newGrid: (0 | 1)[][] = [];

    for (let i = 0; i < numOfRows; i += 1) {
      newGrid.push(new Array<0 | 1>(numOfColumns).fill(0));
    }

    for (let i = 0; i < numOfRows; i += 1) {
      for (let j = 0; j < numOfColumns; j += 1) {
        if (i < grid.length && j < grid[i].length) {
          newGrid[i][j] = grid[i][j];
        }
      }
    }

    return { grid: newGrid, boundary };
  }

  if (type === 'clearGrid') {
    const newGrid: (0 | 1)[][] = grid.map((arr) => arr.map(() => 0));

    return { grid: newGrid, boundary };
  }

  if (type === 'updateGridBoundary') {
    const { newBoundary } = payload;

    return { grid, boundary: newBoundary };
  }

  return state;
};

// Javascript allows % to return negative remainders
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
