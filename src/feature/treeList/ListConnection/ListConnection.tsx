import { useMemo } from 'react';
import { ListPosition } from '../types';
import { getUUID } from '~/utils/getUUID';

interface ListConnectionProps {
  listPosition: ListPosition[];
  deep: number;
  children: React.ReactNode;
}

export function ListConnection({ listPosition, deep, children }: ListConnectionProps) {
  const data = useMemo(
    // () => listPosition.map((position) => ({ position, id: getUUID() })).slice(1),
    () => listPosition.map((position) => ({ position, id: getUUID() })),
    [listPosition, deep],
  );

  return (
    <div className="min-h-[30px] flex pr-[30px]">
      {data.map((el) => (
        <div key={el.id} className="w-[30px] h-full relative">
          {el.position === ListPosition.BOUND && (
            <>
              <CenterVerticalLine />
            </>
          )}

          {el.position === ListPosition.START && (
            <>
              <CenterVerticalLine />
              <CenterHorizontalHalfLine />
            </>
          )}

          {el.position === ListPosition.CENTER && (
            <>
              <CenterVerticalLine />
              <CenterHorizontalHalfLine />
            </>
          )}

          {el.position === ListPosition.END && (
            <>
              <CenterHorizontalHalfLine />
              <CenterVerticalHalfLine />
            </>
          )}
        </div>
      ))}
      <div
        className="relative z-10 pl-[30px] w-[30px] h-full flex justify-center items-center"
        onDoubleClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function CenterVerticalLine() {
  return <div className="absolute left-1/2 -top-1/2 w-[2px] h-[200%] bg-gray-500" />;
}

function CenterVerticalHalfLine() {
  return <div className="absolute left-1/2 -top-1/2 w-[2px] h-full bg-gray-500" />;
}

function CenterHorizontalHalfLine() {
  return <div className="absolute left-1/2 top-1/2 w-full h-[2px] bg-gray-500" />;
}
