import { fireEvent, render } from '@testing-library/react';
import React from 'react';
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

  it('className and style props should work on img element', () => {
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

  it('classNames.root and styles.root should work on image wrapper element', () => {
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        classNames={{
          root: 'bamboo',
        }}
        styles={{
          root: {
            objectFit: 'cover',
          },
        }}
      />,
    );
    const wrapperElement = container.firstChild;
    expect(wrapperElement).toHaveClass('bamboo');
    expect(wrapperElement).toHaveStyle({ objectFit: 'cover' });
  });

  // https://github.com/ant-design/ant-design/issues/36680
  it('preview mask should be hidden when image has style { display: "none" }', () => {
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        style={{
          display: 'none',
        }}
        preview={{ cover: 'Click to Preview' }}
      />,
    );
    const maskElement = container.querySelector('.rc-image-cover');
    expect(maskElement).toHaveStyle({ display: 'none' });
  });
  it('preview zIndex should pass', () => {
    const { baseElement } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{ zIndex: 9999, open: true }}
      />,
    );
    const operationsElement = baseElement.querySelector('.rc-image-preview');
    expect(operationsElement).toHaveStyle({ zIndex: 9999 });
  });
});
