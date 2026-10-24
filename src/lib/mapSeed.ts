export function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function mulberry32(a: number): () => number {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

interface HexPosition {
  q: number;
  r: number;
}

export function computeHexLayout(seed: string, count: number): HexPosition[] {
  const rng = mulberry32(hashSeed(seed));
  const positions: HexPosition[] = [];
  const visited = new Set<string>();
  
  const key = (q: number, r: number) => `${q},${r}`;
  
  const radius = 8;
  const candidates: HexPosition[] = [];
  
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      candidates.push({ q, r });
    }
  }
  
  positions.push({ q: 0, r: 0 });
  visited.add(key(0, 0));
  
  const queue: HexPosition[] = [{ q: 0, r: 0 }];
  const directions = [
    { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
    { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
  ];
  
  while (positions.length < count && queue.length > 0) {
    const shuffledQueue = [...queue].sort(() => rng() - 0.5);
    const current = shuffledQueue[0];
    queue.splice(queue.indexOf(current), 1);
    
    const neighbors = directions
      .map(d => ({ q: current.q + d.q, r: current.r + d.r }))
      .filter(n => !visited.has(key(n.q, n.r)) && candidates.some(c => c.q === n.q && c.r === n.r));
    
    for (const neighbor of neighbors) {
      if (positions.length >= count) break;
      positions.push(neighbor);
      visited.add(key(neighbor.q, neighbor.r));
      queue.push(neighbor);
    }
  }
  
  while (positions.length < count) {
    const remaining = candidates.filter(c => !visited.has(key(c.q, c.r)));
    if (remaining.length === 0) break;
    const randomPos = remaining[Math.floor(rng() * remaining.length)];
    positions.push(randomPos);
    visited.add(key(randomPos.q, randomPos.r));
  }
  
  return positions.slice(0, count);
}

export function hexToWorld(q: number, r: number, hexSize: number = 1): { x: number; z: number } {
  const x = hexSize * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
  const z = hexSize * (3 / 2 * r);
  return { x, z };
}

export function hexToPixel(q: number, r: number, size: number): { x: number; y: number } {
  const x = size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
  const y = size * (3 / 2 * r);
  return { x, y };
}
