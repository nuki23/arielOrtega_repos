export interface Pokemon {
  id: number | string;
  name: string;
  weight: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string;
    [key: string]: any; //permitir otros sprites
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  isCustom: boolean | null
  [key: string]: any; // permitir otras propiedades
}
