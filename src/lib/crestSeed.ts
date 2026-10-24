function fnv1aHash(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function extractBytes(hash: number, count: number): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < count; i++) {
    bytes.push((hash >> (i * 8)) & 0xff);
  }
  return bytes;
}

type ShapeType = 'circle' | 'triangle' | 'diamond' | 'hexagon' | 'star';

function getShapePath(shape: ShapeType, cx: number, cy: number, r: number): string {
  switch (shape) {
    case 'circle':
      return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
    case 'triangle': {
      const p1 = `${cx},${cy - r}`;
      const p2 = `${cx - r * 0.866},${cy + r * 0.5}`;
      const p3 = `${cx + r * 0.866},${cy + r * 0.5}`;
      return `M ${p1} L ${p2} L ${p3} Z`;
    }
    case 'diamond':
      return `M ${cx},${cy - r} L ${cx + r},${cy} L ${cx},${cy + r} L ${cx - r},${cy} Z`;
    case 'hexagon': {
      const points: string[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      return `M ${points.join(' L ')} Z`;
    }
    case 'star': {
      const points: string[] = [];
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? r : r * 0.5;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      return `M ${points.join(' L ')} Z`;
    }
  }
}

export function generateCrestSvg(seed: string, size: number): string {
  const hash = fnv1aHash(seed || 'default');
  const bytes = extractBytes(hash, 8);

  const hue1 = (bytes[0] * 360) / 255;
  const hue2 = (bytes[1] * 360) / 255;
  const color1 = `hsl(${hue1}, 60%, 45%)`;
  const color2 = `hsl(${hue2}, 50%, 35%)`;
  const accentColor = `hsl(${(hue1 + 40) % 360}, 70%, 55%)`;

  const shapes: ShapeType[] = ['circle', 'triangle', 'diamond', 'hexagon', 'star'];
  const shapeIndex = bytes[2] % shapes.length;
  const shape = shapes[shapeIndex];

  const borderStyle = bytes[3] % 2 === 0 ? 'dashed' : 'dotted';
  const cx = size / 2;
  const cy = size / 2;
  const shieldR = size * 0.42;
  const shapeR = size * 0.2;

  const shieldPath = `
    M ${cx} ${cy - shieldR}
    C ${cx + shieldR * 0.8} ${cy - shieldR} ${cx + shieldR} ${cy - shieldR * 0.3} ${cx + shieldR} ${cy}
    C ${cx + shieldR} ${cy + shieldR * 0.6} ${cx + shieldR * 0.3} ${cy + shieldR} ${cx} ${cy + shieldR * 1.1}
    C ${cx - shieldR * 0.3} ${cy + shieldR} ${cx - shieldR} ${cy + shieldR * 0.6} ${cx - shieldR} ${cy}
    C ${cx - shieldR} ${cy - shieldR * 0.3} ${cx - shieldR * 0.8} ${cy - shieldR} ${cx} ${cy - shieldR}
    Z
  `.trim();

  const shapePath = getShapePath(shape, cx, cy, shapeR);

  const dots: string[] = [];
  const dotCount = 8 + (bytes[4] % 5);
  const dotRadius = size * 0.015;
  for (let i = 0; i < dotCount; i++) {
    const angle = (Math.PI * 2 * i) / dotCount;
    const dotDist = shieldR * 0.75;
    const dx = cx + dotDist * Math.cos(angle);
    const dy = cy + dotDist * Math.sin(angle);
    dots.push(`<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="${dotRadius}" fill="${accentColor}" opacity="0.6"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg-${seed}" cx="50%" cy="40%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </radialGradient>
    <filter id="shadow-${seed}">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3"/>
    </filter>
  </defs>
  <path d="${shieldPath}" fill="url(#bg-${seed})" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="${borderStyle === 'dashed' ? '4 2' : '1 2'}" filter="url(#shadow-${seed})"/>
  <path d="${shapePath}" fill="${accentColor}" opacity="0.9"/>
  ${dots.join('\n  ')}
</svg>`;
}
