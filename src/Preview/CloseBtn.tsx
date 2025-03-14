import * as React from 'react';

export interface CloseBtnProps {
  prefixCls: string;
  icon?: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function CloseBtn(props: CloseBtnProps) {
  const { prefixCls, icon, onClick } = props;

  return (
    <button className={`${prefixCls}-close`} onClick={onClick}>
      {icon}
    </button>
  );
}
