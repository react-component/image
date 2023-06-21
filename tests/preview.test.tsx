import CloseOutlined from '@ant-design/icons/CloseOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import RotateLeftOutlined from '@ant-design/icons/RotateLeftOutlined';
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined';
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons/ZoomOutOutlined';
import { act, createEvent, fireEvent, render } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';

jest.mock('../src/Preview', () => {
  const MockPreview = (props: any) => {
    global._previewProps = props;

    let Preview = jest.requireActual('../src/Preview');
    Preview = Preview.default || Preview;

    return <Preview {...props} />;
  };

  return MockPreview;
});

import Image from '../src';

describe('Preview', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const fireMouseEvent = (
    eventName: 'mouseDown' | 'mouseMove' | 'mouseUp',
    element: Element | Window,
    info: {
      pageX?: number;
      pageY?: number;
      button?: number;
    } = {},
  ) => {
    const event = createEvent[eventName](element);
    Object.keys(info).forEach(key => {
      Object.defineProperty(event, key, {
        get: () => info[key],
      });
    });

    act(() => {
      fireEvent(element, event);
    });

    act(() => {
      jest.runAllTimers();
    });
  };

  it('Show preview and close', () => {
    const onPreviewCloseMock = jest.fn();
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{
          onVisibleChange: onPreviewCloseMock,
        }}
      />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview')).toBeTruthy();

    // With mask close
    expect(onPreviewCloseMock).toBeCalledWith(true, false);
    fireEvent.click(document.querySelector('.rc-image-preview-wrap'));

    // With btn close
    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelector('.rc-image-preview-operations-operation'));

    expect(onPreviewCloseMock).toBeCalledWith(false, true);

    onPreviewCloseMock.mockRestore();
  });

  it('Unmount', () => {
    const { container, unmount } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(() => {
      unmount();
    }).not.toThrow();
  });

  it('Rotate', () => {
    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[3]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(90deg)',
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[2]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });
  });

  it('Flip', () => {
    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[1]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(-1, 1, 1) rotate(0deg)',
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[0]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(-1, -1, 1) rotate(0deg)',
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[1]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, -1, 1) rotate(0deg)',
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[0]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });
  });

  it('Scale', () => {
    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[5]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(-256px, -192px, 0) scale3d(1.5, 1.5, 1) rotate(0deg)',
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[4]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[5]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(-256px, -192px, 0) scale3d(1.5, 1.5, 1) rotate(0deg)',
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[4]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireEvent.wheel(document.querySelector('.rc-image-preview-img'), {
      deltaY: -50,
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1.25, 1.25, 1) rotate(0deg)',
    });

    fireEvent.wheel(document.querySelector('.rc-image-preview-img'), {
      deltaY: 50,
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    for (let i = 0; i < 50; i++) {
      fireEvent.wheel(document.querySelector('.rc-image-preview-img'), {
        deltaY: -100,
      });
      act(() => {
        jest.runAllTimers();
      });
    }
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(50, 50, 1) rotate(0deg)',
    });
  });

  it('scaleStep = 1', () => {
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{
          scaleStep: 1,
        }}
      />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[4]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[5]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(-512px, -384px, 0) scale3d(2, 2, 1) rotate(0deg)',
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[4]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireEvent.wheel(document.querySelector('.rc-image-preview-img'), {
      deltaY: -50,
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1.5, 1.5, 1) rotate(0deg)',
    });

    fireEvent.wheel(document.querySelector('.rc-image-preview-img'), {
      deltaY: 50,
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });
  });

  it('Reset scale on double click', () => {
    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[5]);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(-256px, -192px, 0) scale3d(1.5, 1.5, 1) rotate(0deg)',
    });

    fireEvent.dblClick(document.querySelector('.rc-image-preview-img'));
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });
  });

  it('Reset position on double click', () => {
    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 0,
    });
    fireMouseEvent('mouseMove', window, {
      pageX: 50,
      pageY: 50,
    });

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(50px, 50px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireEvent.dblClick(document.querySelector('.rc-image-preview-img'));
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(75px, 75px, 0) scale3d(1.5, 1.5, 1) rotate(0deg)',
    });
  });

  it('Mouse Event', () => {
    const clientWidthMock = jest
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockImplementation(() => 1080);

    let offsetWidth = 200;
    let offsetHeight = 100;
    let left = 0;
    let top = 0;

    const imgEleMock = spyElementPrototypes(HTMLImageElement, {
      offsetWidth: {
        get: () => offsetWidth,
      },
      offsetHeight: {
        get: () => offsetHeight,
      },
      getBoundingClientRect: () => {
        return { left, top };
      },
    });
    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 2,
    });
    expect(document.querySelector('.rc-image-preview-moving')).toBeFalsy();

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 0,
    });
    expect(document.querySelector('.rc-image-preview-moving')).toBeTruthy();

    fireMouseEvent('mouseMove', window, {
      pageX: 50,
      pageY: 50,
    });
    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(50px, 50px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireMouseEvent('mouseUp', window);

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    fireMouseEvent('mouseUp', window);

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    fireMouseEvent('mouseMove', window, {
      pageX: 1,
      pageY: 1,
    });

    left = 100;
    top = 100;
    offsetWidth = 2000;
    offsetHeight = 1000;
    fireMouseEvent('mouseUp', window);

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(460px, 116px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    left = -200;
    top = -200;
    offsetWidth = 2000;
    offsetHeight = 1000;

    fireMouseEvent('mouseUp', window);

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(460px, 116px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    fireMouseEvent('mouseMove', window, {
      pageX: 1,
      pageY: 1,
    });

    left = -200;
    top = -200;
    offsetWidth = 1000;
    offsetHeight = 500;

    fireMouseEvent('mouseUp', window);

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    fireMouseEvent('mouseMove', window, {
      pageX: 1,
      pageY: 1,
    });

    left = -200;
    top = -200;
    offsetWidth = 1200;
    offsetHeight = 600;
    fireMouseEvent('mouseUp', window);

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(-60px, -84px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    fireMouseEvent('mouseMove', window, {
      pageX: 1,
      pageY: 1,
    });

    left = -200;
    top = -200;
    offsetWidth = 1000;
    offsetHeight = 900;
    fireMouseEvent('mouseUp', window);

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(-40px, -66px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });

    fireEvent.wheel(document.querySelector('.rc-image-preview-img'), {
      deltaY: -50,
    });

    fireMouseEvent('mouseDown', document.querySelector('.rc-image-preview-img'), {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    fireMouseEvent('mouseMove', window, {
      pageX: 1,
      pageY: 1,
    });

    fireMouseEvent('mouseUp', window);

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(-85px, -65px, 0) scale3d(1.25, 1.25, 1) rotate(0deg)',
    });

    // Clear
    clientWidthMock.mockRestore();
    imgEleMock.mockRestore();
    jest.restoreAllMocks();
  });

  it('PreviewGroup', () => {
    const { container } = render(
      <Image.PreviewGroup
        icons={{
          rotateLeft: <RotateLeftOutlined />,
          rotateRight: <RotateRightOutlined />,
          zoomIn: <ZoomInOutlined />,
          zoomOut: <ZoomOutOutlined />,
          close: <CloseOutlined />,
          left: <LeftOutlined />,
          right: <RightOutlined />,
        }}
      >
        <Image
          className="group-1"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        <Image
          className="group-2"
          src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ"
        />
      </Image.PreviewGroup>,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelectorAll('.anticon')[1]);
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelector('.rc-image-preview-wrap'));

    fireEvent.click(container.querySelectorAll('.rc-image')[1]);
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelectorAll('.anticon')[0]);
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelector('.rc-image-preview-wrap'));
  });

  it('preview placeholder', () => {
    render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{
          mask: 'Bamboo Is Light',
          maskClassName: 'bamboo',
        }}
      />,
    );

    expect(document.querySelector('.rc-image-mask').textContent).toEqual('Bamboo Is Light');
    expect(document.querySelector('.rc-image-mask')).toHaveClass('bamboo');
  });

  it('previewSrc', () => {
    const src =
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/auto-orient,1/resize,p_10/quality,q_10';
    const previewSrc =
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const { container } = render(<Image src={src} preview={{ src: previewSrc }} />);

    expect(container.querySelector('.rc-image-img')).toHaveAttribute('src', src);
    expect(document.querySelector('.rc-image-preview')).toBeFalsy();

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview')).toBeTruthy();
    expect(document.querySelector('.rc-image-preview-img')).toHaveAttribute('src', previewSrc);
  });

  it('Customize preview props', () => {
    const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    render(
      <Image
        src={src}
        preview={{
          visible: true,
          transitionName: 'abc',
          maskTransitionName: 'def',
        }}
      />,
    );

    expect(global._previewProps).toEqual(
      expect.objectContaining({
        transitionName: 'abc',
        maskTransitionName: 'def',
      }),
    );
  });

  it('Customize Group preview props', () => {
    const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    render(
      <Image.PreviewGroup
        preview={{ visible: true, transitionName: 'abc', maskTransitionName: 'def' }}
      >
        <Image src={src} />
      </Image.PreviewGroup>,
    );

    expect(global._previewProps).toEqual(
      expect.objectContaining({
        transitionName: 'abc',
        maskTransitionName: 'def',
      }),
    );
  });

  it('add rootClassName should be correct', () => {
    const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const { container, asFragment } = render(<Image src={src} rootClassName="custom-className" />);

    expect(container.querySelectorAll('.custom-className')).toHaveLength(1);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('add rootClassName should be correct when open preview', () => {
    const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const previewSrc =
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

    const { container } = render(
      <Image src={src} preview={{ src: previewSrc }} rootClassName="custom-className" />,
    );
    expect(container.querySelector('.rc-image.custom-className .rc-image-img')).toHaveAttribute(
      'src',
      src,
    );
    expect(document.querySelector('.rc-image-preview-root.custom-className')).toBeFalsy();

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(
      document.querySelector('.rc-image-preview-root.custom-className .rc-image-preview'),
    ).toBeTruthy();
    expect(document.querySelector('.rc-image-preview-root.custom-className')).toBeTruthy();
    expect(
      document.querySelector('.rc-image-preview-root.custom-className .rc-image-preview-img'),
    ).toHaveAttribute('src', previewSrc);

    expect(Array.from(document.body.children)).toMatchSnapshot();
  });

  it('if async src set should be correct', () => {
    const src =
      'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ';
    const AsyncImage = ({ src: imgSrc }) => {
      const normalSrc =
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
      return (
        <Image.PreviewGroup>
          <Image src={imgSrc} />
          <Image src={normalSrc} />
        </Image.PreviewGroup>
      );
    };

    const { container, rerender } = render(<AsyncImage src="" />);
    rerender(<AsyncImage src={src} />);

    fireEvent.click(container.querySelector('.rc-image'));

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview-img')).toHaveAttribute('src', src);

    expect(document.querySelector('.rc-image-preview-switch-left')).toHaveClass(
      'rc-image-preview-switch-left-disabled',
    );
  });

  it('pass img common props to previewed image', () => {
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        referrerPolicy="no-referrer"
      />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview-img')).toHaveAttribute(
      'referrerPolicy',
      'no-referrer',
    );
  });

  it('toolbarRender', () => {
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{
          toolbarRender: (_, { icons }) => (
            <>
              {icons.flipYIcon}
              {icons.flipXIcon}
            </>
          ),
        }}
      />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelectorAll('.rc-image-preview-operations-operation')).toHaveLength(2);
  });

  it('onTransform should be triggered when transform change', () => {
    const onTransform = jest.fn();
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{ onTransform }}
      />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview')).toBeTruthy();

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[0]);
    act(() => {
      jest.runAllTimers();
    });

    expect(onTransform).toBeCalledTimes(1);
    expect(onTransform).toBeCalledWith({
      transform: {
        flipY: true,
        flipX: false,
        rotate: 0,
        scale: 1,
        x: 0,
        y: 0,
      },
      action: 'flipY',
    });
  });

  it('imageRender', () => {
    const { container } = render(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{
          imageRender: () => (
            <video
              width="100%"
              controls
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
            />
          ),
        }}
      />,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('video')).toBeTruthy();
  });
});
