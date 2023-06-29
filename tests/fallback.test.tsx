import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import Image from '../src';

jest.mock('../src/util', () => {
  const { isImageValid, ...rest } = jest.requireActual('../src/util');

  return {
    ...rest,
    isImageValid: () => Promise.resolve(false),
  };
});

describe('Fallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const fallback = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

  it('Fallback correct', async () => {
    const { container } = render(<Image src="abc" fallback={fallback} />);

    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('img').src).toEqual(fallback);
  });

  it('PreviewGroup Fallback correct', async () => {
    const { container } = render(
      <Image.PreviewGroup fallback={fallback}>
        <Image src="abc" />
      </Image.PreviewGroup>,
    );

    fireEvent.click(container.querySelector('.rc-image-img'));

    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    expect(document.querySelector('.rc-image-preview-img')).toHaveAttribute('src', fallback);
  });

  it('should not show preview', () => {
    const { container } = render(<Image src="abc" fallback={fallback} />);

    fireEvent.error(container.querySelector('.rc-image-img'));
    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelector('.rc-image-mask')).toBeFalsy();
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
