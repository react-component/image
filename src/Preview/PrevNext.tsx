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

  const prevDisabled = current === 0;
  const nextDisabled = current === count - 1;

  return (
    <>
      <button
        className={clsx(switchCls, `${switchCls}-prev`, {
          [`${switchCls}-disabled`]: prevDisabled,
        })}
        onClick={() => onActive(-1)}
        disabled={prevDisabled}
      >
        {prev ?? left}
      </button>
      <button
        type="button"
        className={clsx(switchCls, `${switchCls}-next`, {
          [`${switchCls}-disabled`]: nextDisabled,
        })}
        onClick={() => onActive(1)}
        disabled={nextDisabled}
      >
        {next ?? right}
      </button>
    </>
  );
}
