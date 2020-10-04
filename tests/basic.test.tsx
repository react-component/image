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
  test('imgClass and imgStyle props should work', () => {
    const wrapper = mount(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        imgClass="img"
        imgStyle={{
          objectFit: 'cover',
        }}
      />,
    );
    const imgWrapper = wrapper.find('img');
    expect(imgWrapper.props().className).toContain('img');
    expect(imgWrapper.props().style.objectFit).toEqual('cover');
  });
  // wrapper element will auto-scale to fit img element
  test('width and height props should only be applied on img element', () => {
    const wrapper = mount(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        height="400px"
        width="400px"
      />,
    );
    const img = wrapper.find('img');
    const parentWrapper = img.parent();
    expect(img.props().style.height).toEqual('400px');
    expect(img.props().style.width).toEqual('400px');
    expect(parentWrapper.props().style.width).toBeUndefined();
    expect(parentWrapper.props().style.height).toBeUndefined();
  });
});
