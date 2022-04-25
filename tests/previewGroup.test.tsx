import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
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
    const { container, unmount } = render(
      <Image.PreviewGroup>
        <Image src="src1" />
        <Image src="src2" />
      </Image.PreviewGroup>,
    );

    fireEvent.click(container.querySelector('.rc-image'));

    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-image-preview')).toBeTruthy();

    const previewProgressElement = document.querySelector(
      '.rc-image-preview .rc-image-preview-operations-progress',
    );

    expect(previewProgressElement).toBeTruthy();
    expect(previewProgressElement.textContent).toEqual('1 / 2');

    expect(() => {
      unmount();
    }).not.toThrow();
  });

  it('Disable preview', () => {
    const { container } = render(
      <Image.PreviewGroup>
        <Image src="src1" preview={false} />
      </Image.PreviewGroup>,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview')).toBeFalsy();
  });

  it('Preview with Custom Preview Property', () => {
    const { container } = render(
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

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    const previewProgressElement = document.querySelector(
      '.rc-image-preview .rc-image-preview-operations-progress',
    );

    expect(previewProgressElement).toBeTruthy();
    expect(previewProgressElement.textContent).toEqual('current:1 / total:3');
  });

  it('Switch', () => {
    const previewProgressElementPath = '.rc-image-preview .rc-image-preview-operations-progress';
    const { container } = render(
      <Image.PreviewGroup>
        <Image src="src1" />
        <Image src="src2" preview={false} />
        <Image src="src3" />
      </Image.PreviewGroup>,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(
      document.querySelector('.rc-image-preview .rc-image-preview-switch-left-disabled'),
    ).toBeTruthy();
    expect(document.querySelector(previewProgressElementPath).textContent).toEqual('1 / 2');

    fireEvent.click(document.querySelector('.rc-image-preview .rc-image-preview-switch-right'));
    act(() => {
      jest.runAllTimers();
    });

    expect(
      document.querySelector('.rc-image-preview .rc-image-preview-switch-right-disabled'),
    ).toBeTruthy();
    expect(document.querySelector(previewProgressElementPath).textContent).toEqual('2 / 2');

    fireEvent.click(document.querySelector('.rc-image-preview .rc-image-preview-switch-left'));
    act(() => {
      jest.runAllTimers();
    });

    expect(
      document.querySelector('.rc-image-preview .rc-image-preview-switch-left-disabled'),
    ).toBeTruthy();

    fireEvent.keyDown(window, { keyCode: KeyCode.RIGHT });
    act(() => {
      jest.runAllTimers();
    });

    expect(
      document.querySelector('.rc-image-preview .rc-image-preview-switch-right-disabled'),
    ).toBeTruthy();

    fireEvent.keyDown(window, { keyCode: KeyCode.LEFT });
    act(() => {
      jest.runAllTimers();
    });

    expect(
      document.querySelector('.rc-image-preview .rc-image-preview-switch-left-disabled'),
    ).toBeTruthy();
  });

  it('With Controlled', () => {
    const { rerender } = render(
      <Image.PreviewGroup preview={{ visible: true }}>
        <Image src="src1" />
      </Image.PreviewGroup>,
    );

    expect(document.querySelector('.rc-image-preview')).toBeTruthy();

    rerender(
      <Image.PreviewGroup preview={{ visible: false }}>
        <Image src="src1" />
      </Image.PreviewGroup>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview')).toMatchSnapshot();
  });
});
