import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '../../utils/gsapSetup';

interface ImageMaskRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'center';
  parallax?: boolean;
}

export function ImageMaskReveal({
  children,
  className = '',
  direction = 'up',
  parallax = false,
}: ImageMaskRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const fromClip =
      direction === 'left'
        ? 'inset(0% 100% 0% 0%)'
        : direction === 'center'
          ? 'inset(12% 8% 12% 8%)'
          : 'inset(22% 0% 0% 0%)';

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapper,
        { clipPath: fromClip },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 95%',
            end: 'bottom 2%',
            toggleActions: 'play none play none',
          },
        },
      );

      gsap.fromTo(
        inner,
        { scale: parallax ? 1.14 : 1.09 },
        {
          scale: parallax ? 1.06 : 1,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 95%',
            end: 'bottom 2%',
            toggleActions: 'play none play none',
          },
        },
      );

      if (parallax) {
        gsap.fromTo(
          inner,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, [direction, parallax]);

  return (
    <div ref={wrapperRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="w-full h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
