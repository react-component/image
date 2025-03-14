import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import Image from '../src';

describe('Controlled', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  it('With previewVisible', () => {
    const { rerender } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{ open: true }}
      />,
    );

    expect(document.querySelector('.rc-image-preview')).toBeTruthy();

    rerender(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{ open: false }}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview')).toMatchSnapshot();
  });

  it('controlled current in group', () => {
    const { rerender } = render(
      <Image.PreviewGroup preview={{ current: 1 }}>
        <Image src="src1" className="first-img" />
        <Image src="src2" />
        <Image src="src3" />
      </Image.PreviewGroup>,
    );

    fireEvent.click(document.querySelector('.first-img'));

    expect(document.querySelector('.rc-image-preview-img')).toHaveAttribute('src', 'src2');

    rerender(
      <Image.PreviewGroup preview={{ current: 2 }}>
        <Image src="src1" className="first-img" />
        <Image src="src2" />
        <Image src="src3" />
      </Image.PreviewGroup>,
    );

    expect(document.querySelector('.rc-image-preview-img')).toHaveAttribute('src', 'src3');
  });
});
