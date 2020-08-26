import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import Image from '../src';

describe('Preview', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Show preview and close', () => {
    let initialTimeNow = 0;
    const dateMock = jest.spyOn(global.Date, 'now').mockImplementation(() => {
      initialTimeNow += 100;
      return initialTimeNow;
    });
    const onPreviewCloseMock = jest.fn();
    const wrapper = mount(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        onPreviewClose={onPreviewCloseMock}
      />,
    );

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview').get(0)).toBeTruthy();

    // With mask close
    wrapper.find('.rc-image-preview-wrap').simulate('click');
    expect(onPreviewCloseMock).toBeCalledTimes(1);

    // With btn close
    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    act(() => {
      wrapper
        .find('.rc-image-preview-operations-operation')
        .at(0)
        .simulate('click');
    });

    expect(onPreviewCloseMock).toBeCalledTimes(2);

    dateMock.mockRestore();
  });

  it('Unmount', () => {
    const wrapper = mount(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  it('Rotate', () => {
    const wrapper = mount(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    wrapper.find('.rc-image-preview-wrap').simulate('click');

    act(() => {
      wrapper
        .find('.rc-image-preview-operations-operation')
        .at(3)
        .simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(1, 1, 1) rotate(90deg)',
    });

    act(() => {
      wrapper
        .find('.rc-image-preview-operations-operation')
        .at(4)
        .simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(1, 1, 1) rotate(0deg)',
    });
  });

  it('Scale', () => {
    const wrapper = mount(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    wrapper.find('.rc-image-preview-wrap').simulate('click');

    act(() => {
      wrapper
        .find('.rc-image-preview-operations-operation')
        .at(2)
        .simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(1, 1, 1) rotate(0deg)',
    });

    act(() => {
      wrapper
        .find('.rc-image-preview-operations-operation')
        .at(1)
        .simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(2, 2, 1) rotate(0deg)',
    });

    act(() => {
      wrapper
        .find('.rc-image-preview-operations-operation')
        .at(2)
        .simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(1, 1, 1) rotate(0deg)',
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
    const wrapper = mount(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    wrapper.find('.rc-image').simulate('click');

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
    });

    expect(wrapper.find('.rc-image-preview-moving').get(0)).toBeTruthy();

    const mousemoveEvent = new Event('mousemove');

    // @ts-ignore
    mousemoveEvent.pageX = 50;
    // @ts-ignore
    mousemoveEvent.pageY = 50;

    act(() => {
      global.dispatchEvent(mousemoveEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(50px, 50px, 0)',
    });

    const mouseupEvent = new Event('mouseup');

    act(() => {
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(0px, 0px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
    });

    act(() => {
      offsetWidth = 2000;
      offsetHeight = 1000;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(0px, 0px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
    });

    act(() => {
      left = 100;
      top = 100;
      offsetWidth = 2000;
      offsetHeight = 1000;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(460px, 116px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
    });

    act(() => {
      left = -200;
      top = -200;
      offsetWidth = 2000;
      offsetHeight = 1000;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(460px, 116px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
    });

    act(() => {
      left = -200;
      top = -200;
      offsetWidth = 1000;
      offsetHeight = 500;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(0px, 0px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
    });

    act(() => {
      left = -200;
      top = -200;
      offsetWidth = 1200;
      offsetHeight = 600;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(-60px, -84px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
    });

    act(() => {
      left = -200;
      top = -200;
      offsetWidth = 1000;
      offsetHeight = 900;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(-40px, -66px, 0)',
    });

    // Clear
    clientWidthMock.mockRestore();
    imgEleMock.mockRestore();
    jest.restoreAllMocks();
  });
});
