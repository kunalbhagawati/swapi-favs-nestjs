// Type alias for now. Can change into a separate model later.
export type Movie = {
  created: string;
  release_date: string;
  title: string;
  url: string;
};

export type MovieWithFavoriteMetadata = Movie & {
  updated: string | null;
  is_favourite: boolean;
  original_title: string;
};
