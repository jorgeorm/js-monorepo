/**
 * RapidAPI Client Error Module
 */

export type RapidApiClientErrorData = {
  /**
   * The URL of the resource that caused the error.
   */
  resource: string;
  /**
   * The HTTP status code returned by the API.
   */
  status: number;
  /**
   * The status text returned by the API.
   */
  statusText: string;
};

/**
 * Custom error class for RapidAPI client errors.
 *
 * This class extends the built-in Error class to provide additional
 * information about the error, including the resource URL, status code,
 * and status text.
 */
export class RapidApiClientError extends Error {
  constructor(
    /**
     * The error message.
     */
    message: string,
    /**
     * Additional data related to the error.
     */
    protected data: RapidApiClientErrorData = {} as RapidApiClientErrorData
  ) {
    super(message);
    this.name = 'RapidApiClientError';
  }
}
