export interface Availability {
  itemType: 'show' | 'movie';
  showType: 'series' | 'movie';
  id: string;
  imdbId: string;
  tmdbId: string;
  title: string;
  overview: string;
  firstAirYear: number;
  lastAirYear: number;
  originalTitle: string;
  genres: AvailabilityGenre[];
  creators: string[];
  cast: string[];
  rating: number;
  seasonCount: number;
  episodeCount: number;
  imageSet: AvailabilityImageSet;
  streamingOptions: AvailabilityStreamingOptions;
}

export interface AvailabilityGenre {
  id: string;
  name: string;
}

export interface AvailabilityImageSet {
  verticalPoster: AvailabilityPoster;
  horizontalPoster: AvailabilityPoster;
  horizontalBackdrop: AvailabilityPoster;
  // verticalBackdrop is optional as it does not always appear
  verticalBackdrop?: AvailabilityPoster;
}

export interface AvailabilityPoster {
  w240?: string;
  w360?: string;
  w480?: string;
  w600?: string;
  w720?: string;
  w1080?: string;
  w1440?: string;
}

export type AvailabilityStreamingOptions = {
  [key: string]: AvailabilityStreamingOption[];
};

export interface AvailabilityStreamingOption {
  service: AvailabilityStreamingService;
  type: 'subscription' | 'addon';
  link: string;
  videoLink?: string;
  quality: string;
  addon?: AvailabilityAddon;
  audios: AvailabilityAudio[];
  subtitles: AvailabilitySubtitle[];
  expiresSoon: boolean;
  availableSince: number;
}

export interface AvailabilityStreamingService {
  id: string;
  name: string;
  homePage: string;
  themeColorCode: string;
  imageSet: AvailabilityServiceImageSet;
}

export interface AvailabilityServiceImageSet {
  lightThemeImage: string;
  darkThemeImage: string;
  whiteImage: string;
}

export interface AvailabilityAddon {
  id: string;
  name: string;
  homePage: string;
  themeColorCode: string;
  imageSet: AvailabilityServiceImageSet;
}

export interface AvailabilityAudio {
  language: string;
  region?: string;
}

export interface AvailabilitySubtitle {
  closedCaptions: boolean;
  locale: {
    language: string;
    region?: string;
  };
}
