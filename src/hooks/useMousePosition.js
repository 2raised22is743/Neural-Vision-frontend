import { useEffect, useRef } from 'react';

/**
 * Custom React hook to capture and normalize mouse cursor position.
 * Normalized between -1 and 1 on both axes.
 * 
 * @returns {React.MutableRefObject<{x: number, y: number}>} Normalized coordinates ref
 */
export default function useMousePosition() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mouseRef;
}
