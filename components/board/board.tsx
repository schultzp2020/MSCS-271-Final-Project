import { useCallback, useState } from 'react';
import { Cell } from '../cell';

interface CellType {
  id: number;
  alive: boolean;
}

export interface BoardProps {
  size: number;
}

export const Board = (props: BoardProps): JSX.Element => {
  const { size } = props;

  const [cellArray, setCellArray] = useState<CellType[]>(() => {
    const array: CellType[] = [];
    for (let i = 0; i < size ** 2; i += 1) {
      array.push({ id: i, alive: false });
    }
    return array;
  });

  const onCellUpdate = useCallback(
    (newState: boolean, id: number) => {
      const newCellArray = cellArray.map((cell: CellType) => {
        if (cell.id === id) {
          console.log({ ...cell, alive: newState });
          return { ...cell, alive: newState };
        }

        return cell;
      });
      setCellArray(newCellArray);
    },
    [cellArray],
  );

  return (
    <div className="grid grid-cols-25">
      {cellArray.map((cell: CellType) => (
        <Cell key={cell.id} id={cell.id} alive={false} mutatable onUpdate={onCellUpdate} />
      ))}
    </div>
  );
};
