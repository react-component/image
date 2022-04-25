import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Image from '../src';

describe('Basic', () => {
  it('snapshot', () => {
    const { asFragment } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
      />,
    );

    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('With click', () => {
    const onClickMock = jest.fn();
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        onClick={onClickMock}
      />,
    );

    fireEvent.click(container.querySelector('.rc-image'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('With click when disable preview', () => {
    const onClickMock = jest.fn();
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        onClick={onClickMock}
        preview={false}
      />,
    );

    fireEvent.click(container.querySelector('.rc-image'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
  test('className and style props should work on img element', () => {
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        className="img"
        style={{
          objectFit: 'cover',
        }}
      />,
    );
    const img = container.querySelector('img');
    expect(img).toHaveClass('img');
    expect(img).toHaveStyle({ objectFit: 'cover' });
  });
  test('wrapperClassName and wrapperStyle should work on image wrapper element', () => {
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        wrapperClassName="wrapper"
        wrapperStyle={{
          objectFit: 'cover',
        }}
      />,
    );
    const wrapperElement = container.querySelector('img').parentElement;
    expect(wrapperElement).toHaveClass('wrapper');
    expect(wrapperElement).toHaveStyle({ objectFit: 'cover' });
  });
});
