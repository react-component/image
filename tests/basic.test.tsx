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

  it('wrapperClassName and wrapperStyle should work on image wrapper element', () => {
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

  // https://github.com/ant-design/ant-design/issues/36680
  it('preview mask should be hidden when image has style { display: "none" }', () => {
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        style={{
          display: 'none',
        }}
        preview={{ mask: 'Click to Preview' }}
      />,
    );
    const maskElement = container.querySelector('.rc-image-mask');
    expect(maskElement).toHaveStyle({ display: 'none' });
  });

  it('Valid image after few switching of src', async () => {
    const valid1 = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const valid2 =
      'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*NZuwQp_vcIQAAAAAAAAAAABkARQnAQ';
    const fallback =
      'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp';

    const images = ['error', valid1, 'error', valid2];

    const TestCase = () => {
      const [idx, setIdx] = React.useState(0);

      React.useEffect(() => {
        if (idx < images.length - 1) {
          setIdx(idx + 1);
        }
      }, [idx]);

      return <Image src={images[idx]} fallback={fallback} />;
    };

    const { container } = render(<TestCase />);
    const maskElement = container.querySelector('.rc-image-img');

    expect(maskElement).toHaveAttribute('src', valid2);
  });
});
