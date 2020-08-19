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

  it('Fallback correct', () => {
    const fallback = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
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
});
