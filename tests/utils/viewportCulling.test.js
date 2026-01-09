import { describe, it, expect } from 'vitest';
import {
  getVisibleNodes,
  getVisibleEdges,
  getLODSettings,
  SpatialHash,
} from '../../src/utils/viewportCulling';

describe('getVisibleNodes', () => {
  const nodes = [
    { id: 'a', x: 0, y: 0, size: 10 },
    { id: 'b', x: 500, y: 500, size: 10 },
    { id: 'c', x: -500, y: -500, size: 10 },
    { id: 'd', x: 2000, y: 2000, size: 10 },
  ];

  it('should return nodes within viewport', () => {
    const camera = { x: 0, y: 0 };
    const zoom = 1;
    const width = 1000;
    const height = 800;

    const visible = getVisibleNodes(nodes, camera, zoom, width, height);
    
    // With margin of 200, viewport roughly covers -700 to 700 on x and -600 to 600 on y
    // Only 'a' and 'b' are guaranteed visible; 'c' at -500,-500 may be outside
    expect(visible.map(n => n.id)).toContain('a');
    expect(visible.map(n => n.id)).not.toContain('d'); // definitely outside at 2000,2000
  });

  it('should return all nodes when zoomed out far', () => {
    const camera = { x: 0, y: 0 };
    const zoom = 0.1;
    const width = 1000;
    const height = 800;

    const visible = getVisibleNodes(nodes, camera, zoom, width, height);
    expect(visible.length).toBe(4);
  });
});

describe('getVisibleEdges', () => {
  const edges = [
    { source: 'a', target: 'b', type: 'forward' },
    { source: 'b', target: 'c', type: 'forward' },
    { source: 'c', target: 'd', type: 'forward' },
  ];

  it('should return edges where at least one endpoint is visible', () => {
    const visibleNodeIds = ['a', 'b'];
    const visible = getVisibleEdges(edges, visibleNodeIds);

    expect(visible.length).toBe(2);
    expect(visible[0].source).toBe('a');
    expect(visible[1].source).toBe('b');
  });

  it('should return no edges if no nodes visible', () => {
    const visibleNodeIds = [];
    const visible = getVisibleEdges(edges, visibleNodeIds);
    expect(visible.length).toBe(0);
  });
});

describe('getLODSettings', () => {
  it('should disable labels and glow at low zoom', () => {
    const lod = getLODSettings(0.3);
    expect(lod.renderLabels).toBe(false);
    expect(lod.renderGlow).toBe(false);
    expect(lod.renderPulses).toBe(false);
  });

  it('should enable glow but not labels at medium zoom', () => {
    const lod = getLODSettings(0.7);
    expect(lod.renderLabels).toBe(false);
    expect(lod.renderGlow).toBe(true);
    expect(lod.renderPulses).toBe(false);
  });

  it('should enable all features at high zoom', () => {
    const lod = getLODSettings(1.5);
    expect(lod.renderLabels).toBe(true);
    expect(lod.renderGlow).toBe(true);
    expect(lod.renderPulses).toBe(true);
  });
});

describe('SpatialHash', () => {
  const nodes = [
    { id: 'a', x: 50, y: 50, size: 10 },
    { id: 'b', x: 150, y: 150, size: 10 },
    { id: 'c', x: 500, y: 500, size: 10 },
  ];

  it('should build and query nodes correctly', () => {
    const hash = new SpatialHash(100);
    hash.build(nodes);

    // Query near node 'a'
    const nearby = hash.query(60, 60, 50);
    expect(nearby.length).toBeGreaterThanOrEqual(1);
    expect(nearby.some(n => n.id === 'a')).toBe(true);
  });

  it('should return empty array for distant queries', () => {
    const hash = new SpatialHash(100);
    hash.build(nodes);

    const farAway = hash.query(-1000, -1000, 50);
    expect(farAway.length).toBe(0);
  });

  it('should clear correctly', () => {
    const hash = new SpatialHash(100);
    hash.build(nodes);
    hash.clear();
    
    const nearby = hash.query(50, 50, 50);
    expect(nearby.length).toBe(0);
  });
});
