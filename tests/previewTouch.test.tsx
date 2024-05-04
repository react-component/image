import { act, fireEvent, render } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';
import Image from '../src';

describe('Touch Events', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('touch move', () => {
    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));

    const previewImgDom = document.querySelector('.rc-image-preview-img');

    fireEvent.touchStart(previewImgDom, {
      touches: [{ clientX: 0, clientY: 0 }],
    });
    fireEvent.touchMove(previewImgDom, {
      touches: [{ clientX: 50, clientY: 50 }],
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(previewImgDom).toHaveStyle({
      transform: 'translate3d(50px, 50px, 0) scale3d(1, 1, 1) rotate(0deg)',
      // Disable transition during image movement
      transitionDuration: '0s',
    });

    fireEvent.touchEnd(previewImgDom);

    act(() => {
      jest.runAllTimers();
    });

    // Correct the position when the image moves out of the current window
    expect(previewImgDom).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
      transitionDuration: undefined,
    });
  });

  it('touch zoom', () => {
    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));

    const previewImgDom = document.querySelector('.rc-image-preview-img');

    fireEvent.touchStart(previewImgDom, {
      touches: [
        { clientX: 40, clientY: 40 },
        { clientX: 60, clientY: 60 },
      ],
    });
    fireEvent.touchMove(previewImgDom, {
      touches: [
        { clientX: 30, clientY: 30 },
        { clientX: 70, clientY: 70 },
      ],
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(previewImgDom).toHaveStyle({
      transform: 'translate3d(-50px, -50px, 0) scale3d(2, 2, 1) rotate(0deg)',
      // Disable transition during image zooming
      transitionDuration: '0s',
    });

    fireEvent.touchEnd(previewImgDom);

    expect(previewImgDom).toHaveStyle({
      transform: 'translate3d(-50px, -50px, 0) scale3d(2, 2, 1) rotate(0deg)',
      transitionDuration: undefined,
    });
  });

  it('Calculation of the center point during image scaling', () => {
    const imgEleMock = spyElementPrototypes(HTMLImageElement, {
      width: { get: () => 375 },
      height: { get: () => 368 },
      offsetWidth: { get: () => 375 },
      offsetHeight: { get: () => 368 },
      offsetLeft: { get: () => 0 },
      offsetTop: { get: () => 149 },
    });

    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));

    const previewImgDom = document.querySelector('.rc-image-preview-img');

    fireEvent.touchStart(previewImgDom, {
      touches: [
        { clientX: 40, clientY: 40 },
        { clientX: 60, clientY: 60 },
      ],
    });
    fireEvent.touchMove(previewImgDom, {
      touches: [
        { clientX: 10, clientY: 10 },
        { clientX: 70, clientY: 70 },
      ],
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(previewImgDom).toHaveStyle({
      transform: 'translate3d(265px, 556px, 0) scale3d(3, 3, 1) rotate(0deg)',
    });

    // Cover the test when the movement distance of both points is 0
    fireEvent.touchMove(previewImgDom, {
      touches: [
        { clientX: 10, clientY: 10 },
        { clientX: 70, clientY: 70 },
      ],
    });

    imgEleMock.mockRestore();
  });

  it('The scale needs to be reset when the image is scaled to less than minScale', () => {
    const { container } = render(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    fireEvent.click(container.querySelector('.rc-image'));

    const previewImgDom = document.querySelector('.rc-image-preview-img');

    // The scale needs to be reset when the image is scaled to less than minScale
    fireEvent.touchStart(previewImgDom, {
      touches: [
        { clientX: 20, clientY: 40 },
        { clientX: 20, clientY: 60 },
      ],
    });
    fireEvent.touchMove(previewImgDom, {
      touches: [
        { clientX: 20, clientY: 45 },
        { clientX: 20, clientY: 55 },
      ],
    });

    act(() => {
      jest.runAllTimers();
    });

    fireEvent.touchEnd(previewImgDom);

    act(() => {
      jest.runAllTimers();
    });

    expect(previewImgDom).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });
  });
});
