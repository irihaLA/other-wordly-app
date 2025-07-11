
export interface UntranslatableWord {
  word: string;
  native_script: string | null;
  pronunciation: string;
  definition: string;
  origin_country: string;
  origin_language: string;
  theme: string;
  reasoning?: string; // Reasoning is optional, e.g., for "Surprise Me"
}

export interface FavoriteWord extends UntranslatableWord {
    backgroundImage?: string | null;
}

export enum AppStatus {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

export enum ImageGenStatus {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

export enum View {
  SEARCH,
  FAVORITES,
}
