import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import Image from '../src';

describe('Placeholder', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Default placeholder', () => {
    const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const { container } = render(<Image src={src} placeholder />);

    expect(container.querySelector('.rc-image-placeholder')).toBeFalsy();
    expect(container.querySelector('.rc-image-img-placeholder')).toHaveAttribute('src', src);
  });

  it('Set correct', () => {
    const placeholder = 'placeholder';
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        placeholder={placeholder}
      />,
    );
    expect(container.querySelector('.rc-image-placeholder').textContent).toBe(placeholder);

    fireEvent.load(container.querySelector('.rc-image-img'));
    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelector('.rc-image-placeholder')).toBeFalsy();
  });

  it('Hide placeholder when load from cache', () => {
    const domSpy = spyElementPrototypes(HTMLImageElement, {
      complete: {
        get: () => true,
      },
      naturalWidth: {
        get: () => 1004,
      },
      naturalHeight: {
        get: () => 986,
      },
    });

    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        placeholder={<></>}
      />,
    );

    expect(container.querySelector('.rc-image-placeholder')).toBeFalsy();

    domSpy.mockRestore();
  });
});
