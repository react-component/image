import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import Image, { ImageRef } from '../src';

describe('Image ref forwarding', () => {
  // 测试对象类型的 ref
  it('should provide access to internal img element via nativeElement', () => {
    const ref = React.createRef<ImageRef>();
    const { container } = render(
      <Image
        ref={ref}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        alt="test image"
      />,
    );

    // 确保 ref.current.nativeElement 指向正确的 img 元素
    expect(ref.current).not.toBeNull();
    expect(ref.current?.nativeElement).not.toBeNull();
    expect(ref.current?.nativeElement).toBe(container.querySelector('.rc-image-img'));
    expect(ref.current?.nativeElement?.tagName).toBe('IMG');
    expect(ref.current?.nativeElement?.alt).toBe('test image');
  });

  // 测试回调类型的 ref
  it('should work with callback ref', () => {
    let imgRef: ImageRef | null = null;
    const callbackRef = (el: ImageRef | null) => {
      imgRef = el;
    };

    const { container } = render(
      <Image
        ref={callbackRef}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );

    // 确保回调 ref 被调用，且 nativeElement 指向正确的 img 元素
    expect(imgRef).not.toBeNull();
    expect(imgRef?.nativeElement).not.toBeNull();
    expect(imgRef?.nativeElement).toBe(container.querySelector('.rc-image-img'));
  });

  // 测试通过 nativeElement 访问 img 元素的属性和方法
  it('should allow access to img element properties and methods via nativeElement', () => {
    const ref = React.createRef<ImageRef>();
    render(
      <Image
        ref={ref}
        width={200}
        height={100}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );

    // 确保可以通过 ref.nativeElement 访问 img 元素的属性
    expect(ref.current?.nativeElement?.width).toBe(200);
    expect(ref.current?.nativeElement?.height).toBe(100);

    // 可以测试调用 img 元素的方法
    // 注意：某些方法可能在 jsdom 环境中不可用，根据实际情况调整
  });

  // 测试 ref.nativeElement 在组件重新渲染时保持稳定
  it('should maintain stable nativeElement reference across re-renders', () => {
    const ref = React.createRef<ImageRef>();
    const { rerender } = render(
      <Image
        ref={ref}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );

    const initialImgElement = ref.current?.nativeElement;
    expect(initialImgElement).not.toBeNull();

    // 重新渲染组件，但保持 ref 不变
    rerender(
      <Image
        ref={ref}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        alt="updated alt"
      />,
    );

    // 确保 ref.nativeElement 引用的还是同一个 img 元素
    expect(ref.current?.nativeElement).toBe(initialImgElement);
    expect(ref.current?.nativeElement?.alt).toBe('updated alt');
  });

  // 测试 ref 不能直接访问 img 元素属性
  it('should not allow direct access to img element properties', () => {
    const ref = React.createRef<ImageRef>();
    render(
      <Image
        ref={ref}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />,
    );

    // 确保 ref.current 不是 HTMLImageElement
    expect(ref.current).not.toBeNull();
    // @ts-ignore - 故意测试运行时行为
    expect(ref.current.tagName).toBeUndefined();
    // @ts-ignore - 故意测试运行时行为
    expect(ref.current.src).toBeUndefined();
  });
});
