export type ResponsePlanet = {
  created: string;
  name: string;
  url: string;
};

// Type alias for now. Can change into a separate model later.
export type Planet = ResponsePlanet;

export type PlanetWithFavoriteMetadata = Planet & {
  updated: string | null;
  is_favourite: boolean;
  original_name: string;
};
