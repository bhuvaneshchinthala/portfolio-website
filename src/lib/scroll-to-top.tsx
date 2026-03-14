import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

// Component to handle automatic scroll management
export function ScrollToTop() {
  const location = useLocation();
  const prevLocationRef = useRef<string | null>(null);

  const lenis = useLenis();

  useEffect(() => {
    // Check if this is the same page (same pathname)
    const isSamePage = prevLocationRef.current === location.pathname;

    // Check if the URL has a hash
    if (location.hash) {
      setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(location.hash, { offset: 0 });
        } else {
          const element = document.getElementById(location.hash.slice(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      if (lenis) {
        lenis.scrollTo(0, { immediate: !isSamePage });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: isSamePage ? 'smooth' : 'instant' as any
        });
      }
    }

    // Update the previous location reference
    prevLocationRef.current = location.pathname;
  }, [location, lenis]);

  return null;
}
