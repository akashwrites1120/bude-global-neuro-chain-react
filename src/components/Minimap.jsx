import React, { useRef, useMemo } from 'react';
import styles from '../styles/components/Minimap.module.css';

const Minimap = React.memo(({ nodes, clusters, camera, zoom, onNavigate }) => {
  const canvasRef = useRef(null);
  
  // Calculate bounds of all nodes
  const bounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);
    });
    
    const padding = 50;
    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: minY - padding,
      maxY: maxY + padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2
    };
  }, [nodes]);

  // Draw minimap
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 150;
    const height = 150;
    
    canvas.width = width;
    canvas.height = height;

    // Clear with consistent dark background (fixed look)
    ctx.fillStyle = '#0c0c12'; // Fixed "Neuro" dark blue/black
    ctx.fillRect(0, 0, width, height);

    // Scale to fit
    const scale = Math.min(
      width / bounds.width,
      height / bounds.height
    ) * 0.9;

    const offsetX = (width - bounds.width * scale) / 2;
    const offsetY = (height - bounds.height * scale) / 2;

    // Draw nodes
    nodes.forEach(node => {
      const x = (node.x - bounds.minX) * scale + offsetX;
      const y = (node.y - bounds.minY) * scale + offsetY;
      const size = Math.max(1, node.size * scale * 0.1);

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = clusters[node.cluster]?.color || '#888888';
      ctx.globalAlpha = 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw viewport indicator
    const viewportWidth = (window.innerWidth / zoom) * scale;
    const viewportHeight = (window.innerHeight / zoom) * scale;
    const viewportX = (-camera.x / zoom - bounds.minX) * scale + offsetX;
    const viewportY = (-camera.y / zoom - bounds.minY) * scale + offsetY;

    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      viewportX - viewportWidth / 2,
      viewportY - viewportHeight / 2,
      viewportWidth,
      viewportHeight
    );

  }, [nodes, clusters, bounds, camera, zoom]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = Math.min(
      150 / bounds.width,
      150 / bounds.height
    ) * 0.9;

    const offsetX = (150 - bounds.width * scale) / 2;
    const offsetY = (150 - bounds.height * scale) / 2;

    const worldX = (x - offsetX) / scale + bounds.minX;
    const worldY = (y - offsetY) / scale + bounds.minY;

    onNavigate(worldX, worldY);
  };

  return (
    <div className={styles.minimap}>
      <canvas
        ref={canvasRef}
        className={styles.minimapCanvas}
        onClick={handleClick}
      />
      <div className={styles.minimapLabel}>Map</div>
    </div>
  );
});

Minimap.displayName = 'Minimap';

export default Minimap;
