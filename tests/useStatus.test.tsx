import { act, renderHook } from '@testing-library/react';
import useStatus from '../src/hooks/useStatus';
import { isImageValid } from '../src/util';

jest.mock('../src/util', () => ({
  ...jest.requireActual('../src/util'),
  isImageValid: jest.fn(),
}));

const validate = isImageValid as jest.Mock;

describe('crossOrigin status changes', () => {
  beforeEach(() => validate.mockReset());

  it('restores the original image after a new policy succeeds', async () => {
    validate.mockResolvedValueOnce(false);
    const { result, rerender } = renderHook(
      ({ crossOrigin }) =>
        useStatus({ src: 'original.png', fallback: 'fallback.png', crossOrigin }),
      { initialProps: { crossOrigin: 'anonymous' } },
    );
    await act(async () => {});
    expect(result.current[1].src).toBe('fallback.png');

    validate.mockResolvedValueOnce(true);
    rerender({ crossOrigin: 'use-credentials' });
    await act(async () => {});
    expect(result.current[1].src).toBe('original.png');
    expect(result.current[2]).toBe('normal');
  });

  it('keeps a custom placeholder until the image load event', async () => {
    validate.mockResolvedValue(true);
    const { result, rerender } = renderHook(
      ({ crossOrigin }) =>
        useStatus({ src: 'original.png', crossOrigin, isCustomPlaceholder: true }),
      { initialProps: { crossOrigin: 'anonymous' } },
    );
    await act(async () => {});
    rerender({ crossOrigin: 'use-credentials' });
    await act(async () => {});
    expect(result.current[2]).toBe('loading');
    act(() => result.current[1].onLoad?.());
    expect(result.current[2]).toBe('normal');
  });

  it('ignores a failed validation from the previous policy', async () => {
    let failPrevious: (value: boolean) => void;
    validate.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          failPrevious = resolve;
        }),
    );
    const { result, rerender } = renderHook(
      ({ crossOrigin }) =>
        useStatus({ src: 'original.png', fallback: 'fallback.png', crossOrigin }),
      { initialProps: { crossOrigin: 'anonymous' } },
    );
    validate.mockResolvedValueOnce(true);
    rerender({ crossOrigin: 'use-credentials' });
    await act(async () => failPrevious(false));
    expect(result.current[1].src).toBe('original.png');
    expect(result.current[2]).toBe('normal');
  });
});
