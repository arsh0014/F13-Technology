import { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';
import { formatLoaderProgress } from '../../utils/motionConfig';

interface IntroLoaderProps {
  onComplete: () => void;
}

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      tl.fromTo(
        logoRef.current,
        { yPercent: 115, rotationX: 16 },
        {
          yPercent: 0,
          rotationX: 0,
          duration: 0.58,
          ease: 'power4.out',
        },
      )
        .fromTo(
          subtitleRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.42, ease: 'power3.out' },
          '-=0.3',
        )
        .to(
          counter,
          {
            value: 100,
            duration: 0.85,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (percentRef.current) {
                percentRef.current.textContent = formatLoaderProgress(counter.value);
              }
            },
          },
          '-=0.35',
        )
        .to(
          progressBarRef.current,
          {
            scaleX: 1,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          '<',
        )
        .to(
          [logoRef.current, subtitleRef.current],
          {
            yPercent: -120,
            duration: 0.34,
            ease: 'power3.in',
          },
          '+=0.08',
        )
        .to(progressBarRef.current, { opacity: 0, duration: 0.2 }, '<')
        .to(
          topPanelRef.current,
          {
            yPercent: -102,
            duration: 0.68,
            ease: 'expo.inOut',
          },
          '-=0.1',
        )
        .to(
          bottomPanelRef.current,
          {
            yPercent: 102,
            duration: 0.68,
            ease: 'expo.inOut',
          },
          '<',
        );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading Arkon experience"
      className="fixed inset-0 z-[80] overflow-hidden select-none pointer-events-auto"
    >
      <div
        ref={topPanelRef}
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-1/2 bg-[#050505] will-change-transform"
      />
      <div
        ref={bottomPanelRef}
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-1/2 bg-[#050505] will-change-transform"
      />

      <div className="relative z-10 h-full text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-white/55">
          <span>/arkon · Creative Technology</span>
          <span className="font-mono tabular-nums">Zurich · London · New York</span>
        </div>

        <div className="flex flex-col items-center justify-center my-auto">
          <div className="overflow-hidden py-2 [perspective:900px]">
            <div
              ref={logoRef}
              className="font-display font-bold tracking-tight text-white text-5xl sm:text-7xl lg:text-8xl will-change-transform"
            >
              /arkon<span className="text-[#00C2A8]">.</span>
            </div>
          </div>

          <div className="overflow-hidden mt-3">
            <div
              ref={subtitleRef}
              className="text-[11px] uppercase tracking-[0.12em] text-white/60 will-change-transform"
            >
              Strategy · Architecture · Digital Craft
            </div>
          </div>

          <div className="mt-7 w-56 sm:w-72">
            <div className="h-[1px] w-full bg-white/15 overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full w-full bg-[#00C2A8] origin-left scale-x-0 will-change-transform"
              />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span className="text-[11px] uppercase tracking-[0.08em] text-white/50">
            Technology Moves Business
          </span>
          <span
            ref={percentRef}
            data-testid="intro-loader-percent"
            className="font-mono font-medium tabular-nums text-white leading-none"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
          >
            00
          </span>
        </div>
      </div>
    </div>
  );
}
