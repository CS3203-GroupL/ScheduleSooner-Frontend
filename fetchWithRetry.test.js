const { fetchWithRetry } = require('./fetchWithRetry');

global.fetch = jest.fn();

describe('fetchWithRetry', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns data on first try if fetch succeeds', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const data = await fetchWithRetry('/test');
    expect(data).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds', async () => {
    fetch
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ retrySuccess: true }),
      });

    const data = await fetchWithRetry('/test', {}, 1);
    expect(data).toEqual({ retrySuccess: true });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('returns error object after all retries fail', async () => {
    fetch.mockRejectedValue(new Error('always fails'));

    const data = await fetchWithRetry('/test', {}, 2);
    expect(data).toEqual({ error: 'Failed after retries' });
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

