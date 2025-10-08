import { clsx } from 'clsx';
import * as React from 'react';
import type { OperationIcons } from '.';

export interface PrevNextProps {
  prefixCls: string;
  onActive: (offset: number) => void;
  current: number;
  count: number;
  icons: OperationIcons;
}

export default function PrevNext(props: PrevNextProps) {
  const {
    prefixCls,
    onActive,
    current,
    count,
    icons: { left, right, prev, next },
  } = props;

  const switchCls = `${prefixCls}-switch`;

  return (
    <>
      <div
        className={clsx(switchCls, `${switchCls}-prev`, {
          [`${switchCls}-disabled`]: current === 0,
        })}
        onClick={() => onActive(-1)}
      >
        {prev ?? left}
      </div>
      <div
        className={clsx(switchCls, `${switchCls}-next`, {
          [`${switchCls}-disabled`]: current === count - 1,
        })}
        onClick={() => onActive(1)}
      >
        {next ?? right}
      </div>
    </>
  );
}
