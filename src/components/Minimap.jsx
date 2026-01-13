import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import styles from '../styles/components/Minimap.module.css';

const Minimap = React.memo(({ 
  nodes, 
  clusters, 
  camera, 
  zoom, 
  onNavigate,
  hoveredNode,
  selectedNode 
}) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const animationRef = useRef(null);
  
  // Calculate bounds of all nodes with some padding
  const bounds = useMemo(() => {
    if (!nodes || nodes.length === 0) return { minX: -500, maxX: 500, minY: -500, maxY: 500, width: 1000, height: 1000 };
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    nodes.forEach(node => {
      if (typeof node.x === 'number' && typeof node.y === 'number') {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
      }
    });
    
    // Handle case where no valid positions found
    if (!isFinite(minX)) {
      return { minX: -500, maxX: 500, minY: -500, maxY: 500, width: 1000, height: 1000 };
    }
    
    const padding = 100;
    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: minY - padding,
      maxY: maxY + padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2
    };
  }, [nodes]);

  // Dynamic rendering loop for real-time updates
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nodes || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    const size = isExpanded ? 220 : 150;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    // Background - semi-transparent dark
    ctx.fillStyle = 'rgba(10, 10, 18, 0.9)';
    ctx.fillRect(0, 0, size, size);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
      const pos = (size / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    // Scale to fit all nodes
    const scale = Math.min(
      size / bounds.width,
      size / bounds.height
    ) * 0.85;

    const offsetX = (size - bounds.width * scale) / 2;
    const offsetY = (size - bounds.height * scale) / 2;

    // Helper to convert world to minimap coords
    const toMinimap = (x, y) => ({
      x: (x - bounds.minX) * scale + offsetX,
      y: (y - bounds.minY) * scale + offsetY
    });

    // Calculate viewport rectangle
    const viewportWidth = (window.innerWidth / zoom) * scale;
    const viewportHeight = (window.innerHeight / zoom) * scale;
    const viewportPos = toMinimap(-camera.x / zoom, -camera.y / zoom);

    // Draw all nodes
    nodes.forEach(node => {
      if (typeof node.x !== 'number' || typeof node.y !== 'number') return;
      
      const pos = toMinimap(node.x, node.y);
      const baseSize = Math.max(2, Math.min((node.size || 8) * scale * 0.12, 5));
      
      const color = clusters[node.cluster]?.color || '#888888';
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode?.id === node.id;
      
      // Special highlight for hovered/selected
      if (isHovered || isSelected) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, baseSize + 4, 0, Math.PI * 2);
        ctx.fillStyle = color + '50';
        ctx.fill();
      }

      // Node dot
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isHovered || isSelected ? baseSize + 1.5 : baseSize, 0, Math.PI * 2);
      ctx.fillStyle = isHovered || isSelected ? '#ffffff' : color;
      ctx.fill();
    });

    // Draw viewport rectangle (on top of nodes)
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 6;
    ctx.strokeRect(
      viewportPos.x - viewportWidth / 2,
      viewportPos.y - viewportHeight / 2,
      viewportWidth,
      viewportHeight
    );
    ctx.shadowBlur = 0;

    // Viewport fill - very subtle
    ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.fillRect(
      viewportPos.x - viewportWidth / 2,
      viewportPos.y - viewportHeight / 2,
      viewportWidth,
      viewportHeight
    );

    // Center origin marker
    const centerPos = toMinimap(0, 0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerPos.x - 4, centerPos.y);
    ctx.lineTo(centerPos.x + 4, centerPos.y);
    ctx.moveTo(centerPos.x, centerPos.y - 4);
    ctx.lineTo(centerPos.x, centerPos.y + 4);
    ctx.stroke();

  }, [nodes, clusters, bounds, camera, zoom, hoveredNode, selectedNode, isExpanded]);

  // Continuous rendering for dynamic updates
  useEffect(() => {
    let running = true;
    
    const loop = () => {
      if (running) {
        render();
        animationRef.current = requestAnimationFrame(loop);
      }
    };
    
    loop();
    
    return () => {
      running = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [render]);

  const getWorldCoords = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const size = isExpanded ? 220 : 150;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const scale = Math.min(
      size / bounds.width,
      size / bounds.height
    ) * 0.85;

    const offsetX = (size - bounds.width * scale) / 2;
    const offsetY = (size - bounds.height * scale) / 2;

    const worldX = (x - offsetX) / scale + bounds.minX;
    const worldY = (y - offsetY) / scale + bounds.minY;

    return { x: worldX, y: worldY };
  }, [bounds, isExpanded]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const world = getWorldCoords(e.clientX, e.clientY);
    onNavigate(world.x, world.y);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const world = getWorldCoords(e.clientX, e.clientY);
      onNavigate(world.x, world.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`${styles.minimap} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => { setIsExpanded(false); setIsDragging(false); }}
    >
      <canvas
        ref={canvasRef}
        className={styles.minimapCanvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <div className={styles.minimapLabel}>
        <span className={styles.labelIcon}>🗺️</span>
        <span>Navigator</span>
      </div>
      <div className={styles.nodeCount}>
        {nodes?.length || 0} nodes
      </div>
      {isExpanded && (
        <div className={styles.instructions}>
          Click or drag to navigate
        </div>
      )}
    </div>
  );
});

Minimap.displayName = 'Minimap';

export default Minimap;
