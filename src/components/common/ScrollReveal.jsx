import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal - Komponen Animasi Scroll Dua Arah (Bi-directional Scroll Animation)
 *
 * Memicu animasi masuk secara halus saat elemen di-scroll down,
 * dan otomatis mereset kembali saat elemen keluar dari viewport,
 * sehingga saat di-scroll up kembali, animasi berjalan lagi dengan mulus tanpa kaku.
 */
export const ScrollReveal = ({
  children,
  animation = 'fade-up', // 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade'
  delay = 0, // Delay kemunculan dalam milidetik (ms)
  duration = 750, // Durasi animasi (ms)
  repeat = true, // true = animasi berjalan bolak-balik saat scroll down & up
  threshold = 0.12, // Berapa persen elemen terlihat sebelum memicu animasi
  rootMargin = '0px 0px -30px 0px',
  className = '',
  style = {},
  as: Component = 'div',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Cek apakah browser mendukung IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Jika repeat: true, reset ke false saat keluar layar agar scroll up memicu animasi kembali
          if (repeat) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [repeat, threshold, rootMargin]);

  // Transformasi awal saat elemen belum masuk layar
  const getInitialTransform = () => {
    switch (animation) {
      case 'fade-up':
        return 'translateY(28px)';
      case 'fade-down':
        return 'translateY(-28px)';
      case 'fade-left':
        return 'translateX(-28px)';
      case 'fade-right':
        return 'translateX(28px)';
      case 'zoom-in':
        return 'scale(0.93)';
      default:
        return 'none';
    }
  };

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'translateY(0) translateX(0) scale(1)'
      : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: isVisible ? `${delay}ms` : '0ms',
    willChange: 'opacity, transform',
    ...style,
  };

  return (
    <Component
      ref={elementRef}
      className={`scroll-reveal-container ${className}`}
      style={animationStyle}
    >
      {children}
    </Component>
  );
};
