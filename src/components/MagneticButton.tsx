import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '../utils/gsapSetup';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  cursorLabel?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  onClick,
  href,
  className = '',
  type = 'button',
  ariaLabel,
  cursorLabel,
  strength = 0.24,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const xTo = gsap.quickTo(node, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(node, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
      xTo(dx);
      yTo(dy);
    };

    const onLeave = () => {
      gsap.to(node, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'elastic.out(1, 0.45)',
      });
    };

    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);

    return () => {
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(node);
    };
  }, [strength]);

  if (href) {
    return (
      <div ref={wrapRef} className="inline-block will-change-transform">
        <a
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          data-cursor-label={cursorLabel}
          className={className}
        >
          {children}
        </a>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="inline-block will-change-transform">
      <button
        type={type}
        onClick={onClick}
        aria-label={ariaLabel}
        data-cursor-label={cursorLabel}
        className={className}
      >
        {children}
      </button>
    </div>
  );
}
