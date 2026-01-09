import { describe, it, expect, vi } from 'vitest';
import {
  generateShareLink,
  parseShareLink,
} from '../../src/utils/exportHelpers';

describe('generateShareLink', () => {
  beforeEach(() => {
    // Mock window.location
    delete window.location;
    window.location = {
      origin: 'https://example.com',
      pathname: '/neuro-chain/',
    };
  });

  it('should generate link with camera position', () => {
    const camera = { x: 100, y: -200 };
    const zoom = 1.5;
    const link = generateShareLink(camera, zoom);

    expect(link).toContain('x=100');
    expect(link).toContain('y=-200');
    expect(link).toContain('z=1.50');
    expect(link).toContain('https://example.com/neuro-chain/');
  });

  it('should include node ID when provided', () => {
    const camera = { x: 0, y: 0 };
    const zoom = 1;
    const link = generateShareLink(camera, zoom, 'fire');

    expect(link).toContain('node=fire');
  });

  it('should round camera values', () => {
    const camera = { x: 123.456, y: -789.123 };
    const zoom = 1;
    const link = generateShareLink(camera, zoom);

    expect(link).toContain('x=123');
    expect(link).toContain('y=-789');
  });
});

describe('parseShareLink', () => {
  it('should parse URL parameters correctly', () => {
    delete window.location;
    window.location = {
      search: '?x=100&y=-200&z=1.50&node=fire',
    };

    const result = parseShareLink();

    expect(result.camera.x).toBe(100);
    expect(result.camera.y).toBe(-200);
    expect(result.zoom).toBe(1.5);
    expect(result.nodeId).toBe('fire');
  });

  it('should return defaults for missing params', () => {
    delete window.location;
    window.location = { search: '' };

    const result = parseShareLink();

    expect(result.camera.x).toBe(0);
    expect(result.camera.y).toBe(0);
    expect(result.zoom).toBe(1);
    expect(result.nodeId).toBeNull();
  });
});
