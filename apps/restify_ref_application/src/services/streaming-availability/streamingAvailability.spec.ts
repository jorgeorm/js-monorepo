import { describe, expect, it } from '@jest/globals';
import { fetchStreamingAvailabilityByTitle } from './streamingAvilability';
import { SHOWS_BY_TITLE_200 } from './streamingAvailability.mockData';
import {
  MatchersV3,
  PactV4,
  SpecificationVersion,
} from '@pact-foundation/pact';
import path from 'path';
import { RAPIDAPI_KEY } from '../rapidApi.constants';
import { RAPIDAPI_HOST } from './streamingAvailability.constants';

describe('Unit Testing Streaming Availability Service', () => {
  const fetch = global.fetch;
  beforeAll(async () => {
    global.fetch = jest.fn((_: RequestInfo | URL, __?: RequestInit) =>
      Promise.resolve(Response.json(SHOWS_BY_TITLE_200))
    );
  });

  afterAll(() => {
    global.fetch = fetch;
  });

  it('should return streaming availability', async () => {
    const expectedAvailability = [...SHOWS_BY_TITLE_200];

    const response = await fetchStreamingAvailabilityByTitle({
      country: 'US',
      title: 'Inception',
    });

    expect(response).toEqual(expectedAvailability);
  });
});

describe('Pact Testing Streaming Availability Service', () => {
  const provider = new PactV4({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'StreamingAvailabilityConsumer',
    provider: 'StreamingAvailabilityAPI',
    spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
  });

  const EXPECTED_BODY = MatchersV3.like(SHOWS_BY_TITLE_200);

  describe('GET /streamingAvailability', () => {
    it('returns HTTP 200 and the streaming availability of a show', () => {
      return provider
        .addInteraction()
        .given('I have a show title, and country')
        .uponReceiving('a request for streaming availability of the show')
        .withRequest('GET', '/shows/search/title', (reqBuilder) => {
          reqBuilder.query({
            country: 'US',
            title: 'Inception',
            show_type: 'movie',
            output_language: 'en',
          });
          reqBuilder.headers({
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': RAPIDAPI_HOST,
          });
        })
        .willRespondWith(200, (builder) => {
          builder.headers({
            'Content-Type': 'application/json',
          });
          builder.jsonBody(EXPECTED_BODY);
        })
        .executeTest(async (mockServer) => {
          const expectedAvailability = [...SHOWS_BY_TITLE_200];

          const response = await fetchStreamingAvailabilityByTitle(
            {
              country: 'US',
              title: 'Inception',
              show_type: 'movie',
            },
            {
              apiBaseUrl: mockServer.url,
            }
          );

          expect(response).toEqual(expectedAvailability);
        });
    });
  });
});
