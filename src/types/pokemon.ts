export interface PokemonBase {
  name: string;
  url: string;
}

export interface PokemonDetails extends PokemonBase {
  id: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  flavor_text_entries?: { flavor_text: string; language: { name: string } }[];
}

