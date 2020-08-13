import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// @ts-ignore
global.requestAnimationFrame = cb => setTimeout(cb, 0);

Enzyme.configure({ adapter: new Adapter() });
