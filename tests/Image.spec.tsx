import { render } from 'enzyme';
import * as React from 'react';
import Image from '../src';

describe('Image', () => {
  describe('render', () => {
    const image = <Image src="http://aaa.png" />;
    it('renders correctly', () => {
      const wrapper = render(image);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
