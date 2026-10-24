import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { computeHexLayout, hexToWorld } from '../lib/mapSeed';
import { HEX_SIZE } from '../lib/mapConstants';
import type { Tile, Territory, TileWithPosition } from '../types/tile';

export function useTerritory() {
  const { session } = useAuth();
  const [territory, setTerritory] = useState<Territory | null>(null);
  const [tiles, setTiles] = useState<TileWithPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: territoryData, error: territoryError } = await supabase
        .from('territories')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (territoryError) throw territoryError;
      if (!territoryData) throw new Error('سرزمین یافت نشد');

      setTerritory(territoryData as Territory);

      const { data: tilesData, error: tilesError } = await supabase
        .from('tiles')
        .select('*')
        .eq('user_id', session.user.id)
        .order('tile_index', { ascending: true });

      if (tilesError) throw tilesError;
      if (!tilesData) throw new Error('کاشی‌ها یافت نشدند');

      const positions = computeHexLayout(territoryData.shape_seed, 180);
      
      const tilesWithPosition: TileWithPosition[] = (tilesData as Tile[]).map((tile, index) => {
        const pos = positions[index] || { q: 0, r: 0 };
        const world = hexToWorld(pos.q, pos.r, HEX_SIZE);
        return {
          ...tile,
          q: pos.q,
          r: pos.r,
          x: world.x,
          z: world.z,
        };
      });

      setTiles(tilesWithPosition);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در بارگذاری سرزمین';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTileLocally = useCallback((tileIndex: number, patch: Partial<Tile>) => {
    setTiles(prev => prev.map(tile => 
      tile.tile_index === tileIndex ? { ...tile, ...patch } : tile
    ));
  }, []);

  return {
    territory,
    tiles,
    loading,
    error,
    refresh: fetchData,
    updateTileLocally,
  };
}
