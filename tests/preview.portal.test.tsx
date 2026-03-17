import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';

jest.mock('@rc-component/motion', () => {
  const MockCSSMotion = ({ children }: any) => children({ className: '', style: {} });
  return {
    __esModule: true,
    default: MockCSSMotion,
  };
});

jest.mock('@rc-component/portal', () => {
  const React = require('react');

  const MockPortal = (props: any) => {
    (global as any).__portalProps = props;
    return <>{props.children}</>;
  };

  return {
    __esModule: true,
    default: MockPortal,
  };
});

import Preview from '../src/Preview';

describe('Preview portal esc fallback', () => {
  it('uses capture phase for window keydown listener', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <Preview prefixCls="rc-image-preview" open src="x" mousePosition={null} onClose={jest.fn()} />,
    );

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('keeps portal onEsc as fallback', () => {
    const onClose = jest.fn();

    render(
      <Preview prefixCls="rc-image-preview" open src="x" mousePosition={null} onClose={onClose} />,
    );

    act(() => {
      (global as any).__portalProps.onEsc({ top: true });
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('avoids duplicate close when keydown esc already handled (key only)', () => {
    const onClose = jest.fn();

    render(
      <Preview prefixCls="rc-image-preview" open src="x" mousePosition={null} onClose={onClose} />,
    );

    fireEvent.keyDown(window, { key: 'Escape' });

    act(() => {
      (global as any).__portalProps.onEsc({ top: true });
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('avoids duplicate close when keydown esc already handled (keyCode only)', () => {
    const onClose = jest.fn();

    render(
      <Preview prefixCls="rc-image-preview" open src="x" mousePosition={null} onClose={onClose} />,
    );

    fireEvent.keyDown(window, { keyCode: 27 });

    act(() => {
      (global as any).__portalProps.onEsc({ top: true });
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
