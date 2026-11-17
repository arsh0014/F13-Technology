import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../utils/gsapSetup';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'interactive' | 'label'>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkDesktopEligible = () =>
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.innerWidth >= 1024;

    if (!checkDesktopEligible()) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const ringXTo = gsap.quickTo(ring, 'x', { duration: 0.3, ease: 'power3.out' });
    const ringYTo = gsap.quickTo(ring, 'y', { duration: 0.3, ease: 'power3.out' });
    const dotXTo = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const dotYTo = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });

    const onMouseMove = (e: MouseEvent) => {
      setVisible(true);
      ringXTo(e.clientX);
      ringYTo(e.clientY);
      dotXTo(e.clientX);
      dotYTo(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const labelHost = target.closest('[data-cursor-label]') as HTMLElement | null;
      if (labelHost) {
        const label = labelHost.getAttribute('data-cursor-label');
        if (label) {
          setCursorLabel(label);
          setCursorVariant('label');
          return;
        }
      }

      const interactiveHost = target.closest('a, button, select, input, textarea, [role="tab"]');
      if (interactiveHost) {
        setCursorLabel(null);
        setCursorVariant('interactive');
        return;
      }

      setCursorLabel(null);
      setCursorVariant('default');
    };

    const onMouseLeave = () => setVisible(false);
    const onTouchStart = () => setVisible(false);
    const onResize = () => {
      if (!checkDesktopEligible()) {
        setVisible(false);
        setEnabled(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('resize', onResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        data-testid="custom-cursor"
        data-cursor-variant={cursorVariant}
        aria-hidden="true"
        className={`fixed top-0 left-0 z-[90] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {cursorVariant === 'label' && cursorLabel ? (
          <div className="px-4 py-2 rounded-full bg-[#00C2A8] text-[#050505] text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap shadow-xl">
            {cursorLabel}
          </div>
        ) : (
          <div
            className={`rounded-full transition-all duration-200 ease-out border ${
              cursorVariant === 'interactive'
                ? 'w-12 h-12 border-[#00C2A8] bg-[#00C2A8]/15 scale-110'
                : 'w-7 h-7 border-neutral-500/45 bg-transparent scale-100'
            }`}
          />
        )}
      </div>

      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 z-[91] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150 ${
          visible && cursorVariant !== 'label' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`rounded-full transition-transform duration-150 ${
            cursorVariant === 'interactive'
              ? 'w-1.5 h-1.5 bg-[#00C2A8] scale-125'
              : 'w-1.5 h-1.5 bg-neutral-700'
          }`}
        />
      </div>
    </>
  );
}
