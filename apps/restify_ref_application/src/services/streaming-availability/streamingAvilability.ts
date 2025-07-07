import { Availability } from '../../types/availability';
import { ServiceError } from '../errors';
import {
  RAPIDAPI_BASEURL,
  RAPIDAPI_HOST,
} from './streamingAvailability.constants';
import { RAPIDAPI_KEY } from '../rapidApi.constants';
import { ApiOptions } from '../types';

export type StreamingAvailabilityQuery = {
  country: string;
  title: string;
  series_granularity?: 'show' | 'episode' | 'season';
  show_type?: 'series' | 'series_and_movie' | 'movie';
  output_language?: string;
};

/**
 * Fetch streaming availability for a movie or TV show by its title.
 *
 * @remarks
 * This function constructs a query using the provided parameters and sends a GET request to a streaming
 * availability API endpoint. It returns the parsed JSON data as an Availability object.
 *
 * @param query - The query parameters including:
 *   - country: The country code to filter results.
 *   - title: The title of the movie or show to search for.
 *   - series_granularity: (Optional) Level of detail for series, defaults to 'show'.
 *   - show_type: (Optional) Type of the show, defaults to 'series'.
 *   - output_language: (Optional) The output language, defaults to 'en'.
 *
 * @param options - (Optional) Configuration object for API options including:
 *   - apiKey: The API key for authentication.
 *   - apiHost: The API host identifier.
 *   - apiBaseUrl: The base URL for the API.
 *
 * @returns A Promise resolving to an Availability object representing the streaming availability data,
 * or null.
 *
 * @throws ServiceError when the HTTP request fails or the API response is not as expected.
 */
export async function fetchStreamingAvailabilityByTitle(
  {
    country,
    title,
    series_granularity,
    show_type = 'series',
    output_language = 'en',
  }: StreamingAvailabilityQuery,
  {
    apiKey = RAPIDAPI_KEY,
    apiHost = RAPIDAPI_HOST,
    apiBaseUrl = RAPIDAPI_BASEURL,
  }: ApiOptions = {}
): Promise<Availability[]> {
  try {
    const requestQuery = new URLSearchParams();
    requestQuery.append('country', country);
    requestQuery.append('title', title);
    if (series_granularity !== undefined) {
      requestQuery.append('series_granularity', series_granularity);
    }
    requestQuery.append('show_type', show_type);
    requestQuery.append('output_language', output_language);

    const movieParams: RequestInit = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': apiHost,
        'x-rapidapi-key': apiKey,
      },
    };
    const response = await fetch(
      `${apiBaseUrl}/shows/search/title?${requestQuery}`,
      movieParams
    );

    return response.json() as Promise<Availability[]>;
  } catch (error) {
    throw new ServiceError(
      `Error fetching streaming availability for ${title}: ${error.message}`
    );
  }
}
