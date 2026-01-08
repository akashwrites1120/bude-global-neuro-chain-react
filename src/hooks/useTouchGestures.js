import { useEffect } from 'react';

/**
 * Custom hook for mobile touch gestures
 * Supports pinch-to-zoom and two-finger pan
 */
export const useTouchGestures = ({ onZoom, onPan, enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;

    let lastTouches = [];
    let lastDistance = 0;
    let lastCenter = { x: 0, y: 0 };

    const getDistance = (touch1, touch2) => {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getCenter = (touch1, touch2) => {
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastTouches = Array.from(e.touches);
        lastDistance = getDistance(e.touches[0], e.touches[1]);
        lastCenter = getCenter(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const currentCenter = getCenter(e.touches[0], e.touches[1]);

        // Pinch to zoom
        if (lastDistance > 0) {
          const zoomDelta = currentDistance / lastDistance;
          onZoom?.(zoomDelta);
        }

        // Two-finger pan
        if (lastCenter.x !== 0) {
          const dx = currentCenter.x - lastCenter.x;
          const dy = currentCenter.y - lastCenter.y;
          onPan?.(dx, dy);
        }

        lastDistance = currentDistance;
        lastCenter = currentCenter;
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        lastDistance = 0;
        lastCenter = { x: 0, y: 0 };
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onZoom, onPan, enabled]);
};

export default useTouchGestures;
