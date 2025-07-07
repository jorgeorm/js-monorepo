import { describe, it, expect } from '@jest/globals';
import { getMovies } from './handlers';
import { getRestifyHandlerMocks } from '../../testUtils';
import { ServiceError } from '../../services/errors';
import { fetchStreamingAvailabilityByTitle } from '../../services/streaming-availability/streamingAvilability';
import { fetchRatingsByImdbId } from '../../services/movieRatings';

jest.mock('../../services/streamingAvilability', () => ({
  fetchStreamingAvailabilityByTitle: jest.fn(() => Promise.resolve([])),
}));
jest.mock('../../services/movieRatings', () => ({
  fetchRatingsByImdbId: jest.fn(() => Promise.resolve({})),
}));

describe('getMovies handler', () => {
  it('should send movies with status 200 and call next on success', async () => {
    (fetchStreamingAvailabilityByTitle as jest.Mock).mockResolvedValue([]);
    (fetchRatingsByImdbId as jest.Mock).mockResolvedValue({});

    const { req, res, next } = getRestifyHandlerMocks({
      params: {
        title: 'Inception',
        country: 'US',
      },
    });

    await getMovies(req, res, next);

    expect(res.send).toHaveBeenCalledWith(200, []);
    expect(next).toHaveBeenCalled();
  });

  it('should catch errors, send error response and call next with error', async () => {
    (fetchStreamingAvailabilityByTitle as jest.Mock).mockRejectedValue(
      new ServiceError('Error fetching streaming availability')
    );

    const { req, res, next } = getRestifyHandlerMocks({
      params: {
        title: 'Inception',
        country: 'US',
      },
    });

    await getMovies(req, res, next);

    expect(res.send).toHaveBeenCalledWith(500, expect.any(Error));
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
