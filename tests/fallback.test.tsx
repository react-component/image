import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Image from '../src';

describe('Fallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const fallback = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

  it('Fallback correct', () => {
    const { container } = render(<Image src="abc" fallback={fallback} />);

    fireEvent.error(container.querySelector('.rc-image-img'));
    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelector('.rc-image-img')).toHaveAttribute('src', fallback);

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelector('.rc-image-preview')).toBeFalsy();
  });

  it('should not show preview', () => {
    const { container } = render(<Image src="abc" fallback={fallback} />);

    fireEvent.error(container.querySelector('.rc-image-img'));
    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelector('.rc-image-mask')).toBeFalsy();
  });

  it('With onError', () => {
    const onErrorMock = jest.fn();
    const { container } = render(<Image src="abc" onError={onErrorMock} />);

    fireEvent.error(container.querySelector('.rc-image-img'));
    act(() => {
      jest.runAllTimers();
    });

    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it('should change image, not error', () => {
    const { container, rerender } = render(
      <Image
        width={200}
        src="error"
        fallback="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );

    fireEvent.error(container.querySelector('.rc-image-img'));

    rerender(
      <Image
        width={200}
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*NZuwQp_vcIQAAAAAAAAAAABkARQnAQ"
        fallback="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector('.rc-image-img')).toHaveAttribute(
      'src',
      'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*NZuwQp_vcIQAAAAAAAAAAABkARQnAQ',
    );
  });
});
