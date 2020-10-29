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

  it('With click', () => {
    const onClickMock = jest.fn();
    const wrapper = mount(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        onClick={onClickMock}
      />,
    );

    wrapper.simulate('click');

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('With click when disable preview', () => {
    const onClickMock = jest.fn();
    const wrapper = mount(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        onClick={onClickMock}
        preview={false}
      />,
    );

    wrapper.simulate('click');

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
  test('className and style props should work on img element', () => {
    const wrapper = mount(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        className="img"
        style={{
          objectFit: 'cover',
        }}
      />,
    );
    const img = wrapper.find('img');
    expect(img.props().className).toContain('img');
    expect(img.props().style.objectFit).toEqual('cover');
  });
  test('wrapperClassName and wrapperStyle should work on image wrapper element', () => {
    const wrapper = mount(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        wrapperClassName="wrapper"
        wrapperStyle={{
          objectFit: 'cover',
        }}
      />,
    );
    const wrapperElement = wrapper.find('img').parent();
    expect(wrapperElement.props().className).toContain('wrapper');
    expect(wrapperElement.props().style.objectFit).toEqual('cover');
  });
});
