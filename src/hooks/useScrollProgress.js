import { useEffect, useRef } from 'react';

/**
 * Custom React hook to track viewport scroll progress.
 * Updates a shared ref to prevent React re-renders at 60fps.
 * 
 * @returns {React.MutableRefObject<number>} Normalized scroll progress ref (0 to 1)
 */
export default function useScrollProgress() {
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = totalScroll > 0 ? window.scrollY / totalScroll : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial execution

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollRef;
}
