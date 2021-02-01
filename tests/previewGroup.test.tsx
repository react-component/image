import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Image from '../src';

describe('Preview', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Mount and UnMount', () => {
    const wrapper = mount(
      <Image.PreviewGroup>
        <Image src="src1" />
        <Image src="src2" />
      </Image.PreviewGroup>,
    );

    act(() => {
      wrapper
        .find('.rc-image')
        .at(0)
        .simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview').get(0)).toBeTruthy();

    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  it('Disable preview', () => {
    const wrapper = mount(
      <Image.PreviewGroup>
        <Image src="src1" preview={false} />
      </Image.PreviewGroup>,
    );

    act(() => {
      wrapper
        .find('.rc-image')
        .at(0)
        .simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview').get(0)).toBeFalsy();
  });

  it('Switch', () => {
    const wrapper = mount(
      <Image.PreviewGroup>
        <Image src="src1" />
        <Image src="src2" preview={false} />
        <Image src="src3" />
      </Image.PreviewGroup>,
    );

    act(() => {
      wrapper
        .find('.rc-image')
        .at(0)
        .simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper.find('.rc-image-preview .rc-image-preview-switch-left-disabled').get(0),
    ).toBeTruthy();

    act(() => {
      wrapper.find('.rc-image-preview .rc-image-preview-switch-right').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper.find('.rc-image-preview .rc-image-preview-switch-right-disabled').get(0),
    ).toBeTruthy();

    act(() => {
      wrapper.find('.rc-image-preview .rc-image-preview-switch-left').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper.find('.rc-image-preview .rc-image-preview-switch-left-disabled').get(0),
    ).toBeTruthy();
  });

  it('With Controlled', () => {
    const wrapper = mount(
      <Image.PreviewGroup preview={{ visible: true }}>
        <Image src="src1" />
      </Image.PreviewGroup>,
    );

    expect(wrapper.find('.rc-image-preview').get(0)).toBeTruthy();

    act(() => {
      wrapper.setProps({ preview: { visible: false } });
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper
        .find('.rc-image-preview')
        .at(0)
        .render(),
    ).toMatchSnapshot();
  });
});
