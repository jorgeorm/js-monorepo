export interface RatingResponse {
  tmdbId: number;
  imdbId: string;
  lastUpdated: number;
  ratings: Ratings;
  media: Media;
}

export interface Ratings {
  imdb: ImdbRating;
  metacritic: MetacriticRating;
  rotten_tomatoes: RottenTomatoesRating;
  letterboxd: LetterboxdRating;
  allocine: any;
  average: AverageRating;
}

export interface ImdbRating {
  score: number;
  reviewsCount: number;
  url: string;
}

export interface MetacriticRating {
  metascore: number;
  userScore: number;
  averageScore: number;
  url: string;
}

export interface RottenTomatoesRating {
  tomatometer: number;
  tomatometerReviewsCount: number;
  audienceScore: number;
  audienceScoreReviewsCount: number;
  averageScore: number;
  url: string;
}

export interface LetterboxdRating {
  score: number;
  url: string;
}

export interface AverageRating {
  score: number;
}

export interface Media {
  backdrop_path: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  external_ids: ExternalIds;
  director: string;
  media_type: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ExternalIds {
  imdb_id: string;
  wikidata_id: string;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}
