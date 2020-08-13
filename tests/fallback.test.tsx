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
      wrapper.find('.rc-image').simulate('error');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image').prop('src')).toBe(fallback);
  });
});