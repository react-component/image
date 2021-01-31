import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
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
    const wrapper = mount(<Image src="abc" fallback={fallback} />);

    act(() => {
      wrapper.find('.rc-image-img').simulate('error');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-img').prop('src')).toBe(fallback);

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview').get(0)).toBeFalsy();
  });

  it('should not show preview', () => {
    const wrapper = mount(<Image src="abc" fallback={fallback} />);

    act(() => {
      wrapper.find('.rc-image-img').simulate('error');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-mask')).toHaveLength(0);
  });

  it('With onError', () => {
    const onErrorMock = jest.fn();
    const wrapper = mount(<Image src="abc" onError={onErrorMock} />);

    act(() => {
      wrapper.find('.rc-image-img').simulate('error');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });
});
