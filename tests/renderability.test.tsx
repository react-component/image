import React from 'react';
import { createPortal } from 'react-dom';
import { render } from '@testing-library/react';
import Image from '../src';

describe('ReactNode renderability', () => {
  it.each([0, false, null, undefined, ''])('renders a configured cover node %s', coverNode => {
    const { container } = render(
      <Image src="image.png" preview={{ cover: { coverNode, placement: 'top' } }} />,
    );
    expect(container.querySelector('.rc-image-cover-top').textContent).toBe(
      coverNode === 0 ? '0' : '',
    );
  });

  it.each([null, {}])('accepts an empty cover %s', cover => {
    const { container } = render(<Image src="image.png" preview={{ cover }} />);
    expect(container.querySelector('.rc-image-cover').textContent).toBe('');
  });

  it('preserves element, array and portal covers', () => {
    const target = document.createElement('div');
    const covers = [<span key="a">A</span>, [<span key="a">A</span>], createPortal('A', target)];
    const { container, rerender } = render(
      <Image src="image.png" preview={{ cover: covers[0] }} />,
    );
    expect(container.querySelector('.rc-image-cover').textContent).toBe('A');
    rerender(<Image src="image.png" preview={{ cover: covers[1] }} />);
    expect(container.querySelector('.rc-image-cover').textContent).toBe('A');
    rerender(<Image src="image.png" preview={{ cover: covers[2] }} />);
    expect(target.textContent).toBe('A');
  });

  it.each([0, false, null, true, undefined])('preserves the close icon %s', closeIcon => {
    const { baseElement } = render(
      <Image src="image.png" preview={{ open: true, closeIcon, icons: { close: 'DEFAULT' } }} />,
    );
    const button = baseElement.querySelector('.rc-image-preview-close');
    if (closeIcon === false || closeIcon === null) {
      expect(button).toBeNull();
    } else {
      expect(button.textContent).toBe(closeIcon === 0 ? '0' : 'DEFAULT');
    }
  });
});
