import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import KeyCode from 'rc-util/lib/KeyCode';
import Image from '../src';

describe('PreviewGroup', () => {
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
      wrapper.find('.rc-image').at(0).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview').get(0)).toBeTruthy();

    const previewProgressElement = wrapper.find(
      '.rc-image-preview .rc-image-preview-operations-progress',
    );

    expect(previewProgressElement).toBeTruthy();
    expect(previewProgressElement.text()).toEqual('1 / 2');

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
      wrapper.find('.rc-image').at(0).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview').get(0)).toBeFalsy();
  });

  it('Preview with Custom Preview Property', () => {
    const wrapper = mount(
      <Image.PreviewGroup
        preview={{
          countRender: (current, total) => `current:${current} / total:${total}`,
        }}
      >
        <Image src="src1" />
        <Image src="src2" />
        <Image src="src2" />
      </Image.PreviewGroup>,
    );

    act(() => {
      wrapper.find('.rc-image').at(0).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    const previewProgressElement = wrapper.find(
      '.rc-image-preview .rc-image-preview-operations-progress',
    );

    expect(previewProgressElement).toBeTruthy();
    expect(previewProgressElement.text()).toEqual('current:1 / total:3');
  });

  it('Switch', () => {
    const previewProgressElementPath = '.rc-image-preview .rc-image-preview-operations-progress';
    const wrapper = mount(
      <Image.PreviewGroup>
        <Image src="src1" />
        <Image src="src2" preview={false} />
        <Image src="src3" />
      </Image.PreviewGroup>,
    );

    act(() => {
      wrapper.find('.rc-image').at(0).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper.find('.rc-image-preview .rc-image-preview-switch-left-disabled').get(0),
    ).toBeTruthy();
    expect(wrapper.find(previewProgressElementPath).text()).toEqual('1 / 2');

    act(() => {
      wrapper.find('.rc-image-preview .rc-image-preview-switch-right').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper.find('.rc-image-preview .rc-image-preview-switch-right-disabled').get(0),
    ).toBeTruthy();
    expect(wrapper.find(previewProgressElementPath).text()).toEqual('2 / 2');

    act(() => {
      wrapper.find('.rc-image-preview .rc-image-preview-switch-left').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper.find('.rc-image-preview .rc-image-preview-switch-left-disabled').get(0),
    ).toBeTruthy();

    act(() => {
      const event = new KeyboardEvent('keydown', { keyCode: KeyCode.RIGHT });
      global.dispatchEvent(event);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper.find('.rc-image-preview .rc-image-preview-switch-right-disabled').get(0),
    ).toBeTruthy();

    act(() => {
      const event = new KeyboardEvent('keydown', { keyCode: KeyCode.LEFT });
      global.dispatchEvent(event);
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

    expect(wrapper.find('.rc-image-preview').at(0).render()).toMatchSnapshot();
  });
});
