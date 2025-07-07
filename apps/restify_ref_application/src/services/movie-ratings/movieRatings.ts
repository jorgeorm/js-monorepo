import { RatingResponse } from '../../types/ratings';
import { ServiceError } from '../errors';
import { RAPIDAPI_BASEURL, RAPIDAPI_HOST } from './movieRatings.constants';
import { RAPIDAPI_KEY } from '../rapidApi.constants';
import { ApiOptions } from '../types';

/**
 * Fetch movie ratings by IMDb ID from the external API.
 *
 * This function sends an HTTP GET request to retrieve movie ratings using the provided IMDb ID.
 * It supports optional API configuration overrides such as the API key, host, and base URL.
 *
 * @param imdbId - The IMDb identifier of the movie.
 * @param options - Optional parameters for API configuration:
 *   - apiKey: Override for the default API key (defaults to RAPIDAPI_KEY).
 *   - apiHost: Override for the default API host (defaults to RAPIDAPI_HOST).
 *   - apiBaseUrl: Override for the default API base URL (defaults to RAPIDAPI_BASEURL).
 *
 * @returns A promise that resolves to a RatingResponse object containing the movie ratings.
 *
 * @throws {ServiceError} Thrown when there is an error during the API request.
 */
export async function fetchRatingsByImdbId(
  imdbId: string,
  {
    apiKey = RAPIDAPI_KEY,
    apiHost = RAPIDAPI_HOST,
    apiBaseUrl = RAPIDAPI_BASEURL,
  }: ApiOptions = {}
): Promise<RatingResponse> {
  const ratingsOptions: RequestInit = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': apiHost,
      'x-rapidapi-key': apiKey,
    },
  };

  const requestQuery = new URLSearchParams();
  requestQuery.append('id', imdbId);

  try {
    const response = await fetch(
      `${apiBaseUrl}/ratings?${requestQuery}`,
      ratingsOptions
    );

    return response.json() as Promise<RatingResponse>;
  } catch (error) {
    throw new ServiceError(
      `Error fetching movie ratings for ${imdbId}: ${error.message}`
    );
  }
}
