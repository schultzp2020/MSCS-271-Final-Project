import { useCallback } from 'react';

export interface CellProps {
  id: number;
  alive: boolean;
  mutatable: boolean;
  onUpdate: (newState: boolean, id: number) => void;
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export const Cell = (props: CellProps): JSX.Element => {
  const { id, alive, mutatable, onUpdate } = props;

  const onClick = useCallback(() => {
    if (mutatable) onUpdate(!alive, id);
  }, [mutatable, alive, id, onUpdate]);

  return (
    <button
      type="button"
      className={classNames(
        'cursor-pointer select-none border-[1px] border-black',
        alive ? 'bg-black' : 'bg-white',
      )}
      onClick={onClick}
    >
      {id}
    </button>
  );
};
