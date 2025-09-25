import classnames from 'classnames';
import * as React from 'react';

export interface CloseBtnProps {
  prefixCls: string;
  icon?: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
}

export default function CloseBtn(props: CloseBtnProps) {
  const { prefixCls, icon, onClick, className, style } = props;

  return (
    <button
      className={classnames(`${prefixCls}-close`, className)}
      style={style}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
