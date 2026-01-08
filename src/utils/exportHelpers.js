/**
 * Export canvas to PNG image
 */
export const exportToPNG = (canvasRef, filename = 'neuro-chain.png') => {
  if (!canvasRef.current) return;
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvasRef.current.toDataURL('image/png');
  link.click();
};

/**
 * Export graph data to SVG
 */
export const exportToSVG = (nodes, edges, clusters, filename = 'neuro-chain.svg') => {
  // Calculate bounds
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  nodes.forEach(node => {
    minX = Math.min(minX, node.x - node.size);
    maxX = Math.max(maxX, node.x + node.size);
    minY = Math.min(minY, node.y - node.size);
    maxY = Math.max(maxY, node.y + node.size);
  });

  const padding = 100;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const offsetX = -minX + padding;
  const offsetY = -minY + padding;

  // Build SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .node { stroke-width: 2; }
      .edge { stroke-width: 1; fill: none; }
      .label { font-family: 'JetBrains Mono', monospace; font-size: 10px; fill: #e8e6e3; text-anchor: middle; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#0a0a0f"/>
`;

  // Draw edges
  edges.forEach(edge => {
    const source = nodes.find(n => n.id === edge.source);
    const target = nodes.find(n => n.id === edge.target);
    if (!source || !target) return;

    const sColor = clusters[source.cluster]?.color || '#666';
    const tColor = clusters[target.cluster]?.color || '#666';
    
    svg += `  <line x1="${source.x + offsetX}" y1="${source.y + offsetY}" 
                 x2="${target.x + offsetX}" y2="${target.y + offsetY}" 
                 class="edge" stroke="${sColor}" opacity="0.4" 
                 stroke-dasharray="${edge.type === 'backlink' ? '4,4' : '0'}"/>\n`;
  });

  // Draw nodes
  nodes.forEach(node => {
    const color = clusters[node.cluster]?.color || '#666';
    svg += `  <circle cx="${node.x + offsetX}" cy="${node.y + offsetY}" 
                    r="${node.size}" class="node" fill="${color}" stroke="${color}" opacity="0.8"/>\n`;
    if (node.size > 12) {
      svg += `  <text x="${node.x + offsetX}" y="${node.y + offsetY + node.size + 12}" class="label">${node.label}</text>\n`;
    }
  });

  svg += '</svg>';

  // Download
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Generate shareable link with camera position
 */
export const generateShareLink = (camera, zoom, selectedNodeId = null) => {
  const params = new URLSearchParams();
  params.set('x', Math.round(camera.x));
  params.set('y', Math.round(camera.y));
  params.set('z', zoom.toFixed(2));
  if (selectedNodeId) params.set('node', selectedNodeId);
  
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
};

/**
 * Parse URL parameters for camera position
 */
export const parseShareLink = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    camera: {
      x: parseFloat(params.get('x')) || 0,
      y: parseFloat(params.get('y')) || 0
    },
    zoom: parseFloat(params.get('z')) || 1,
    nodeId: params.get('node') || null
  };
};
