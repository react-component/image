import { act, fireEvent, render } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import Image from '../src';

describe('PreviewGroup', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('onChange should be called', () => {
    const onChange = jest.fn();
    const onVisibleChange = jest.fn();
    const { container } = render(
      <Image.PreviewGroup preview={{ onChange, onVisibleChange }}>
        <Image src="src1" className="firstImg" />
        <Image preview={false} src="src2" />
        <Image src="src3" />
        <Image src="errorsrc" alt="error" />
      </Image.PreviewGroup>,
    );

    fireEvent.click(container.querySelector('.firstImg'));
    act(() => {
      jest.runAllTimers();
    });
    expect(onChange).not.toHaveBeenCalled();
    expect(onVisibleChange).toBeCalledWith(true, false, 0);

    fireEvent.click(document.querySelector('.rc-image-preview-switch-right'));
    act(() => {
      jest.runAllTimers();
    });
    expect(onChange).toHaveBeenCalledWith(2, 0);

    fireEvent.click(document.querySelector('.rc-image-preview-switch-right'));
    act(() => {
      jest.runAllTimers();
    });
    expect(onChange).toHaveBeenCalledWith(3, 2);
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

    const previewProgressElement = document.querySelector('.rc-image-preview-operations-progress');

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

    const previewProgressElement = document.querySelector('.rc-image-preview-operations-progress');

    expect(previewProgressElement).toBeTruthy();
    expect(previewProgressElement.textContent).toEqual('current:1 / total:3');
  });

  it('Switch', () => {
    const previewProgressElementPath = '.rc-image-preview-operations-progress';
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

    expect(document.querySelector('.rc-image-preview-switch-left-disabled')).toBeTruthy();
    expect(document.querySelector(previewProgressElementPath).textContent).toEqual('1 / 2');

    fireEvent.click(document.querySelector('.rc-image-preview-switch-right'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview-switch-right-disabled')).toBeTruthy();
    expect(document.querySelector(previewProgressElementPath).textContent).toEqual('2 / 2');

    fireEvent.click(document.querySelector('.rc-image-preview-switch-left'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview-switch-left-disabled')).toBeTruthy();

    fireEvent.keyDown(window, { keyCode: KeyCode.RIGHT });
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview-switch-right-disabled')).toBeTruthy();

    fireEvent.keyDown(window, { keyCode: KeyCode.LEFT });
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview-switch-left-disabled')).toBeTruthy();
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

  it('should show error img', () => {
    render(
      <Image.PreviewGroup preview={{ visible: true }}>
        <Image src="errorsrc" />
      </Image.PreviewGroup>,
    );
    expect(document.querySelector('.rc-image-preview-img')).toHaveAttribute('src', 'errorsrc');
  });

  it('should reset transform when switch', () => {
    const { container } = render(
      <Image.PreviewGroup>
        <Image src="src1" />
        <Image src="src2" />
      </Image.PreviewGroup>,
    );

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(document.querySelectorAll('.rc-image-preview-operations-operation')[3]);
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(90deg)',
    });

    fireEvent.click(document.querySelector('.rc-image-preview-switch-right'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('.rc-image-preview-img')).toHaveStyle({
      transform: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1) rotate(0deg)',
    });
  });

  it('getContainer', () => {
    const { container, rerender } = render(
      <div className="container">
        <Image.PreviewGroup preview={{ getContainer: '.container' }}>
          <Image src="src1" />
          <Image src="src2" />
        </Image.PreviewGroup>
      </div>,
    );

    act(() => {
      jest.runAllTimers();
    });
    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(
      document.querySelector('.container').querySelector('.rc-image-preview-root'),
    ).toBeTruthy();

    const App = () => {
      const warp = React.useRef(null);
      return (
        <div className="container2" ref={warp}>
          <Image.PreviewGroup preview={{ getContainer: () => warp.current }}>
            <Image src="src1" />
            <Image src="src2" />
          </Image.PreviewGroup>
        </div>
      );
    };
    rerender(<App />);

    act(() => {
      jest.runAllTimers();
    });
    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(
      document.querySelector('.container2').querySelector('.rc-image-preview-root'),
    ).toBeTruthy();

    const App2 = () => {
      return (
        <div className="container3">
          <Image.PreviewGroup preview={{ getContainer: document.body }}>
            <Image src="src1" />
            <Image src="src2" />
          </Image.PreviewGroup>
        </div>
      );
    };
    rerender(<App2 />);
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(container.querySelector('.rc-image'));
    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('body').querySelector('.rc-image-preview-root')).toBeTruthy();
  });
});
