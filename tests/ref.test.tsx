import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import Image from '../src';

describe('Image ref forwarding', () => {
  // 测试对象类型的 ref
  it('should forward object ref to internal img element', () => {
    const ref = React.createRef<HTMLImageElement>();
    const { container } = render(
      <Image
        ref={ref}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        alt="test image"
      />,
    );

    // 确保 ref.current 指向正确的 img 元素
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(container.querySelector('.rc-image-img'));
    expect(ref.current?.tagName).toBe('IMG');
    expect(ref.current?.alt).toBe('test image');
  });

  // 测试回调类型的 ref
  it('should work with callback ref', () => {
    let imgElement: HTMLImageElement | null = null;
    const callbackRef = (el: HTMLImageElement | null) => {
      imgElement = el;
    };

    const { container } = render(
      <Image
        ref={callbackRef}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );

    // 确保回调 ref 被调用，且指向正确的 img 元素
    expect(imgElement).not.toBeNull();
    expect(imgElement).toBe(container.querySelector('.rc-image-img'));
  });

  // 测试 ref 能够访问 img 元素的属性和方法
  it('should allow access to img element properties and methods', () => {
    const ref = React.createRef<HTMLImageElement>();
    render(
      <Image
        ref={ref}
        width={200}
        height={100}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );

    // 确保可以通过 ref 访问 img 元素的属性
    expect(ref.current?.width).toBe(200);
    expect(ref.current?.height).toBe(100);

    // 可以测试调用 img 元素的方法
    // 注意：某些方法可能在 jsdom 环境中不可用，根据实际情况调整
  });

  // 测试 ref 在组件重新渲染时保持稳定
  it('should maintain stable ref across re-renders', () => {
    const ref = React.createRef<HTMLImageElement>();
    const { rerender } = render(
      <Image
        ref={ref}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );

    const initialImgElement = ref.current;
    expect(initialImgElement).not.toBeNull();

    // 重新渲染组件，但保持 ref 不变
    rerender(
      <Image
        ref={ref}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        alt="updated alt"
      />,
    );

    // 确保 ref 引用的还是同一个 img 元素
    expect(ref.current).toBe(initialImgElement);
    expect(ref.current?.alt).toBe('updated alt');
  });
});