describe('getFetchPriorityProps', () => {
  afterEach(() => {
    jest.resetModules();
    jest.dontMock('react');
  });

  it('uses lowercase fetchpriority for React 18', () => {
    jest.doMock('react', () => ({
      ...jest.requireActual('react'),
      version: '18.3.1',
    }));

    jest.isolateModules(() => {
      const { getFetchPriorityProps } = require('../src/util');
      expect(getFetchPriorityProps('high')).toEqual({
        fetchpriority: 'high',
      });
    });
  });

  it('uses camelCase fetchPriority for React 19', () => {
    jest.doMock('react', () => ({
      ...jest.requireActual('react'),
      version: '19.2.4',
    }));

    jest.isolateModules(() => {
      const { getFetchPriorityProps } = require('../src/util');
      expect(getFetchPriorityProps('high')).toEqual({
        fetchPriority: 'high',
      });
    });
  });

  it('returns empty props when value is undefined', () => {
    jest.isolateModules(() => {
      const { getFetchPriorityProps } = require('../src/util');
      expect(getFetchPriorityProps()).toEqual({});
    });
  });
});
