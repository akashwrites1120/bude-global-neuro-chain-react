/**
 * Viewport culling - only render nodes visible in current viewport
 * Significantly improves performance for large datasets (10k+ nodes)
 */
export const getVisibleNodes = (nodes, camera, zoom, width, height, margin = 200) => {
  const viewportLeft = (-camera.x - margin) / zoom;
  const viewportRight = (width - camera.x + margin) / zoom;
  const viewportTop = (-camera.y - margin) / zoom;
  const viewportBottom = (height - camera.y + margin) / zoom;

  return nodes.filter(node => {
    return node.x >= viewportLeft &&
           node.x <= viewportRight &&
           node.y >= viewportTop &&
           node.y <= viewportBottom;
  });
};

/**
 * Get visible edges (both endpoints must be visible or one endpoint visible)
 */
export const getVisibleEdges = (edges, visibleNodeIds) => {
  const visibleSet = new Set(visibleNodeIds);
  
  return edges.filter(edge => {
    return visibleSet.has(edge.source) || visibleSet.has(edge.target);
  });
};

/**
 * Level of Detail (LOD) - adjust rendering quality based on zoom level
 */
export const getLODSettings = (zoom) => {
  if (zoom < 0.5) {
    return {
      renderLabels: false,
      renderGlow: false,
      renderPulses: false,
      edgeWidth: 0.5
    };
  } else if (zoom < 1) {
    return {
      renderLabels: false,
      renderGlow: true,
      renderPulses: false,
      edgeWidth: 1
    };
  } else {
    return {
      renderLabels: true,
      renderGlow: true,
      renderPulses: true,
      edgeWidth: 1
    };
  }
};

/**
 * Spatial hash grid for fast proximity queries
 * Useful for hover detection with large node counts
 */
export class SpatialHash {
  constructor(cellSize = 100) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  clear() {
    this.grid.clear();
  }

  insert(node) {
    const cellX = Math.floor(node.x / this.cellSize);
    const cellY = Math.floor(node.y / this.cellSize);
    const key = `${cellX},${cellY}`;

    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key).push(node);
  }

  query(x, y, radius) {
    const results = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    const centerX = Math.floor(x / this.cellSize);
    const centerY = Math.floor(y / this.cellSize);

    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const key = `${centerX + dx},${centerY + dy}`;
        const cell = this.grid.get(key);
        if (cell) {
          results.push(...cell);
        }
      }
    }

    return results;
  }

  build(nodes) {
    this.clear();
    nodes.forEach(node => this.insert(node));
  }
}
