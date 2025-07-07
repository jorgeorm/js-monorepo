import { RatingResponse } from '../../types/ratings';

export const movieRatings200 = {
  tmdbId: 278,
  imdbId: 'tt0111161',
  lastUpdated: 1722897052603,
  ratings: {
    imdb: {
      score: 9.3,
      reviewsCount: 29000000,
      url: 'https://www.imdb.com/title/tt0111161/',
    },
    metacritic: {
      metascore: 82,
      userScore: 8.9,
      averageScore: 8.6,
      url: 'https://www.metacritic.com/movie/the-shawshank-redemption/',
    },
    rotten_tomatoes: {
      tomatometer: 89,
      tomatometerReviewsCount: 141,
      audienceScore: 98,
      audienceScoreReviewsCount: 250000,
      averageScore: 9.4,
      url: 'https://www.rottentomatoes.com/m/shawshank_redemption',
    },
    letterboxd: {
      score: 4.6,
      url: 'https://letterboxd.com/film/the-shawshank-redemption',
    },
    average: {
      score: 9.1,
    },
  },
  media: {
    backdrop_path: '/avedvodAZUcwqevBfm8p4G2NziQ.jpg',
    budget: 25000000,
    genres: [
      {
        id: 18,
        name: 'Drama',
      },
      {
        id: 80,
        name: 'Crime',
      },
    ],
    homepage: '',
    id: 278,
    imdb_id: 'tt0111161',
    origin_country: ['US'],
    original_language: 'en',
    original_title: 'The Shawshank Redemption',
    overview:
      'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.',
    popularity: 227.544,
    poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    release_date: '1994-09-23',
    revenue: 28341469,
    runtime: 142,
    spoken_languages: [
      {
        english_name: 'English',
        iso_639_1: 'en',
        name: 'English',
      },
    ],
    status: 'Released',
    tagline: 'Fear can hold you prisoner. Hope can set you free.',
    title: 'The Shawshank Redemption',
    video: false,
    external_ids: {
      imdb_id: 'tt0111161',
      wikidata_id: 'Q172241',
      facebook_id: null,
      instagram_id: null,
      twitter_id: null,
    },
    director: 'Frank Darabont',
    media_type: 'movie',
  },
} as RatingResponse;
