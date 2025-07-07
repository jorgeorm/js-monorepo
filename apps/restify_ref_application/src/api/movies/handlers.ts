import { Request, Response, Next } from 'restify';
import { fetchStreamingAvailabilityByTitle } from '../../services/streaming-availability/streamingAvilability';
import { fetchRatingsByImdbId } from '../../services/movie-ratings/movieRatings';

/**
 * Retrieves a list of movies.
 * @param req - The HTTP request containing client data.
 * @param res - The HTTP response used to send the movies data or an error response.
 * @param next - The callback function to pass control to the next middleware.
 * @returns A promise that resolves when the operation completes.
 *
 * @remarks
 * - On success, the function responds with a status code of 200 and an array of movies.
 * - On failure, it responds with a status code of 500 and an error message.
 */
export async function getMovies(_: Request, res: Response, next: Next) {
  try {
    const availableMedia = await fetchStreamingAvailabilityByTitle({
      title: 'Inception',
      country: 'US',
    });

    const mediaRatingResults = await Promise.allSettled(
      availableMedia.map((media) => fetchRatingsByImdbId(media.imdbId))
    );

    const mediaRatingsByImdbId = mediaRatingResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .reduce(
        (acc, rating) => ({
          ...acc,
          [rating.imdbId]: rating,
        }),
        {}
      );

    const movies = availableMedia.map((media) => ({
      ...media,
      ratings: mediaRatingsByImdbId[media.imdbId] || null,
    }));

    res.send(200, movies);
    return next();
  } catch (error) {
    res.send(500, new Error('Internal Server Error'));
    return next(error);
  }
}
