export type TileStatus = 'locked' | 'fighting' | 'freed';
export type TileType = 'city' | 'province' | 'state';

export interface Tile {
  id: number;
  user_id: string;
  territory_id: string;
  tile_index: number;
  tile_type: TileType;
  name: string;
  name_meaning: string | null;
  status: TileStatus;
  freed_at: string | null;
  freed_cycle: number | null;
  journal_entry: string | null;
  created_at: string;
  updated_at: string;
}

export interface Territory {
  id: string;
  user_id: string;
  shape_seed: string;
  capital_tile_index: number;
  created_at: string;
  updated_at: string;
}

export interface TileWithPosition extends Tile {
  q: number;
  r: number;
  x: number;
  z: number;
}
