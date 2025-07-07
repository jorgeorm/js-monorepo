import { describe, expect, it } from '@jest/globals';
import { fetchRatingsByImdbId } from './movieRatings';
import { movieRatings200 } from './movieRatings.mockData';
import {
  MatchersV3,
  PactV4,
  SpecificationVersion,
} from '@pact-foundation/pact';
import path from 'path';
import { RAPIDAPI_KEY } from '../rapidApi.constants';
import { RAPIDAPI_HOST } from './movieRatings.constants';

describe('Unit Testing Movie Ratings Service', () => {
  const fetch = global.fetch;
  beforeAll(async () => {
    global.fetch = jest.fn((_: RequestInfo | URL, __?: RequestInit) =>
      Promise.resolve(Response.json(movieRatings200))
    );
  });

  afterAll(() => {
    global.fetch = fetch;
  });

  test('should return movie ratings', async () => {
    const movieId = movieRatings200.imdbId;
    const expectedRatings = {
      ...movieRatings200,
    };

    const response = await fetchRatingsByImdbId(movieId);

    expect(response).toEqual(expectedRatings);
  });
});

describe('Pact Testing Movie Ratings Service', () => {
  const provider = new PactV4({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'MovieRatingsConsumer',
    provider: 'MovieRatingsAPI',
    spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
  });

  const EXPECTED_BODY = MatchersV3.like(movieRatings200);

  describe('GET /moviesRatings', () => {
    it('returns HTTP 200 and the ratings of a movie', () => {
      return provider
        .addInteraction()
        .given('I have a movie')
        .uponReceiving('a request for ratings of the movie')
        .withRequest('GET', '/ratings', (reqBuilder) => {
          reqBuilder.query({
            id: movieRatings200.imdbId,
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
          const movieId = movieRatings200.imdbId;
          const expectedRatings = {
            ...movieRatings200,
          };

          const response = await fetchRatingsByImdbId(movieId, {
            apiBaseUrl: mockServer.url,
          });
          expect(response).toEqual(expectedRatings);
        });
    });
  });
});
