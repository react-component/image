import { act } from 'react-dom/test-utils';
import Image from '../src';

describe('Previewer', () => {
  it('snapshot', () => {
    Image.previewer('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png');

    expect(document.body).toMatchSnapshot();

    act(() => {
      (document.querySelector('.rc-image-preview-operations-operation') as HTMLElement).click();
    });

    expect(document.body).toMatchSnapshot();
  });
});
