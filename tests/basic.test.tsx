import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Image from '../src';

describe('Basic', () => {
  it('snapshot', () => {
    let wrapper;

    act(() => {
      wrapper = mount(
        <Image
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          width={200}
        />,
      );
    });

    expect(wrapper).toMatchSnapshot();
  });
});
