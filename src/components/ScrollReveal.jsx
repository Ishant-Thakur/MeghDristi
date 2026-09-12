import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable ScrollReveal wrapper component using IntersectionObserver
 * Provides smooth staggered animations on scroll
 * @param {string} direction 'up' | 'down' | 'left' | 'right' | 'fade' | 'zoom'
 * @param {number} delay Delay in milliseconds (e.g. 100, 200, 300 for staggered children)
 * @param {number} threshold Trigger threshold (0.1 = 10% visible)
 * @param {string} className Additional Tailwind classes
 */
export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  threshold = 0.12,
  className = '',
  once = true
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, once]);

  // Directional transform offsets
  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 48px, 0)';
      case 'down':
        return 'translate3d(0, -48px, 0)';
      case 'left':
        return 'translate3d(-48px, 0, 0)';
      case 'right':
        return 'translate3d(48px, 0, 0)';
      case 'zoom':
        return 'scale(0.92)';
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
