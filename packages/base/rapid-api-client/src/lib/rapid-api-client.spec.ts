import { RapidApiClient, useRapidApiClient } from './rapid-api-client';
const fetch = global.fetch;
const fetchMock = jest.fn((_: RequestInfo | URL, __?: RequestInit) =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    statusText: 'OK',
  })
);

describe('useRapidApiClient', () => {
  const testApiKey = 'testApiKey';
  const testApiHost = 'testApiHost';

  beforeAll(() => {
    global.fetch = fetchMock as jest.Mock;
  });
  afterAll(() => {
    global.fetch = fetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if apiKey or apiHost is not provided', () => {
    expect(() => useRapidApiClient()).toThrow(
      'Rapid Api Key and Host are required'
    );
  });

  describe('creates RapidApiClient module', () => {
    let rapidApiClient: RapidApiClient;

    beforeEach(() => {
      rapidApiClient = useRapidApiClient({
        apiKey: testApiKey,
        apiHost: testApiHost,
      });
    });

    it('with expected signature', () => {
      expect(Object.isFrozen(rapidApiClient)).toBe(true);
      expect(rapidApiClient.get).toBeDefined();
      expect(typeof rapidApiClient.get).toBe('function');
    });

    describe('get method', () => {
      it('should throw RapidApiClientError if response is not ok', async () => {
        fetchMock.mockResolvedValueOnce({
          ok: false,
          statusText: 'Test Error',
          json: () => {
            throw new Error('Should no be called');
          },
        });

        await expect(rapidApiClient.get('https://example.com')).rejects.toThrow(
          'Failed to GET<https://example.com>: Test Error'
        );
      });

      it('should call fetch with correct parameters', async () => {
        const { get } = useRapidApiClient({
          apiKey: testApiKey,
          apiHost: testApiHost,
        });

        await get('https://example.com');

        expect(fetchMock).toHaveBeenCalledWith('https://example.com', {
          method: 'GET',
          headers: {
            'x-rapidapi-key': testApiKey,
            'x-rapidapi-host': testApiHost,
            'Content-Type': 'application/json',
          },
        });
      });
    });
  });
});
