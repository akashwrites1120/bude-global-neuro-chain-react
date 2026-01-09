import React, { useRef, useEffect, useState, useMemo } from 'react';
import styles from '../styles/components/CanvasNetwork.module.css';
import { getVisibleNodes, getVisibleEdges, getLODSettings, SpatialHash } from '../utils/viewportCulling';
import { config } from '../config/env';

const CanvasNetwork = React.memo(({
  data,
  hoveredNode,
  setHoveredNode,
  setMousePos,
  animating,
  cameraTarget,
  canvasRef: externalCanvasRef
}) => {
  const internalCanvasRef = useRef(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const spatialHashRef = useRef(new SpatialHash(100));

  // Process nodes with animation properties
  const processedNodes = useMemo(() => {
    const nodes = data.nodes.map(n => ({
      ...n,
      originalX: n.x,
      originalY: n.y,
      vx: 0,
      vy: 0
    }));
    // Build spatial hash for fast hover detection
    spatialHashRef.current.build(nodes);
    return nodes;
  }, [data.nodes]);

  // Create node map for O(1) lookups
  const nodeMap = useMemo(() => {
    return new Map(processedNodes.map(n => [n.id, n]));
  }, [processedNodes]);

  // Filter valid edges
  const processedEdges = useMemo(() => {
    return data.edges.filter(e => nodeMap.has(e.source) && nodeMap.has(e.target));
  }, [data.edges, nodeMap]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth camera interpolation
  useEffect(() => {
    const interval = setInterval(() => {
      setCamera(prev => ({
        x: prev.x + (cameraTarget.x - prev.x) * 0.08,
        y: prev.y + (cameraTarget.y - prev.y) * 0.08
      }));
    }, 16);

    return () => clearInterval(interval);
  }, [cameraTarget]);

  // Screen to world coordinates
  const screenToWorld = (sx, sy) => {
    return {
      x: (sx - dimensions.width / 2 - camera.x) / zoom,
      y: (sy - dimensions.height / 2 - camera.y) / zoom
    };
  };

  // Mouse move handler
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setCamera(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const world = screenToWorld(mouseX, mouseY);
    let found = null;

    for (const node of processedNodes) {
      const dx = world.x - node.x;
      const dy = world.y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.size * 1.4) {
        found = node;
        break;
      }
    }

    setHoveredNode(found);
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.25, Math.min(3, prev * (e.deltaY > 0 ? 0.92 : 1.08))));
  };

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = dimensions.width + 'px';
    canvas.style.height = dimensions.height + 'px';
    ctx.scale(dpr, dpr);

    const animate = () => {
      if (animating) {
        timeRef.current += 0.006;
      }

      const time = timeRef.current;

      // Update node positions with drift
      processedNodes.forEach(node => {
        if (animating) {
          const drift = Math.sin(time + node.originalX * 0.01) * 2;
          node.x = node.originalX + drift;
          node.y = node.originalY + Math.cos(time + node.originalY * 0.01) * 2;
        } else {
          node.x = node.originalX;
          node.y = node.originalY;
        }
      });

      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      ctx.save();
      ctx.translate(dimensions.width / 2 + camera.x, dimensions.height / 2 + camera.y);
      ctx.scale(zoom, zoom);

      // Get LOD settings based on zoom level
      const lod = getLODSettings(zoom);

      // Draw edges
      processedEdges.forEach(edge => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return;

        const sColor = data.clusters[source.cluster]?.color || '#666';
        const tColor = data.clusters[target.cluster]?.color || '#666';

        const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
        gradient.addColorStop(0, sColor + '40');
        gradient.addColorStop(1, tColor + '40');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = edge.type === 'backlink' ? 1.5 : 1;

        if (edge.type === 'backlink') {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }

        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        const offset = Math.sin(time * 2 + source.x * 0.05) * 12;

        ctx.moveTo(source.x, source.y);
        ctx.quadraticCurveTo(midX + offset, midY + offset, target.x, target.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pulse animation
        const pulsePos = (time * 0.25 + edge.source.charCodeAt(0) * 0.1) % 1;
        const pulseX = source.x + (target.x - source.x) * pulsePos;
        const pulseY = source.y + (target.y - source.y) * pulsePos;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = sColor + '80';
        ctx.fill();
      });

      // Draw nodes
      processedNodes.forEach(node => {
        const isHovered = hoveredNode?.id === node.id;
        const size = isHovered ? node.size * 1.25 : node.size;
        const color = data.clusters[node.cluster]?.color || '#666';

        // Glow effect
        const glowSize = size * 2.5;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
        glow.addColorStop(0, color + '25');
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        const ng = ctx.createRadialGradient(
          node.x - size * 0.3,
          node.y - size * 0.3,
          0,
          node.x,
          node.y,
          size
        );
        ng.addColorStop(0, color);
        ng.addColorStop(1, color + '70');
        ctx.fillStyle = ng;
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Special ring animation for fire and agi
        if (node.id === 'fire' || node.id === 'agi') {
          for (let i = 0; i < 3; i++) {
            const phase = (time + i * 0.33) % 1;
            const ringSize = size + phase * size * 2;
            const alpha = (1 - phase) * 0.25;
            ctx.beginPath();
            ctx.arc(node.x, node.y, ringSize, 0, Math.PI * 2);
            ctx.strokeStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Label
        if (isHovered || node.size > 15) {
          ctx.font = `${isHovered ? '11px' : '9px'} 'JetBrains Mono', monospace`;
          ctx.fillStyle = '#e8e6e3';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + size + 14);
        }
      });

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, camera, zoom, animating, processedNodes, processedEdges, nodeMap, data.clusters, hoveredNode]);

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : (hoveredNode ? 'pointer' : 'grab') }}
      />
    </div>
  );
});

CanvasNetwork.displayName = 'CanvasNetwork';

export default CanvasNetwork;
