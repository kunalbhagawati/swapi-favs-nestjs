// Type alias for now. Can change into a separate model later.
export type Planet = {
  created: string;
  name: string;
  url: string;
};

export type PlanetWithFavoriteMetadata = Planet & {
  updated: string | null;
  is_favourite: boolean;
  original_name: string;
};
