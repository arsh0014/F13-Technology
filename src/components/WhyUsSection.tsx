import { useEffect, useRef } from 'react';
import { WHY_US_PILLARS } from '../data/siteContent';
import { gsap } from '../utils/gsapSetup';
import { ThreeSculpture } from './ThreeSculpture';
import { SplitText } from './motion/SplitText';

interface WhyUsSectionProps {
  introComplete?: boolean;
}

export function WhyUsSection({ introComplete = true }: WhyUsSectionProps) {
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = pillarsRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const items = container.querySelectorAll('[data-pillar-row]');
      const lines = container.querySelectorAll('[data-pillar-line]');

      gsap.fromTo(
        items,
        { y: 18 },
        {
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 99%',
            end: 'bottom 2%',
            toggleActions: 'play none play none',
          },
        },
      );

      gsap.fromTo(
        lines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 99%',
            end: 'bottom 2%',
            toggleActions: 'play none play none',
          },
        },
      );
    }, pillarsRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="programs"
      data-nav-theme="dark"
      aria-label="Advisory programs and why work with Arkon"
      className="scroll-mt-12 py-20 sm:py-28 lg:py-36 bg-[#050505] text-white border-t border-white/10"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Editorial Headline + 3D Architectural Sculpture */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#00C2A8] mb-4">
                / Programs · Engagement Architecture
              </div>
              <SplitText
                as="h2"
                text="Built to endure"
                accentSuffix="."
                mode="words"
                className="font-display font-semibold tracking-[-0.04em] text-white leading-[0.98]"
                style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.85rem)' }}
              />
            </div>

            <div
              data-cursor-label="Click / Drag 3D"
              className="border border-white/12 rounded-2xl overflow-hidden bg-[#050505]"
            >
              <div className="aspect-[4/3]">
                <ThreeSculpture active={introComplete} />
              </div>
              <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-[11px] uppercase tracking-[0.06em] text-white/55">
                <span>Spatial Architecture</span>
                <span className="text-[#00C2A8]">Drag or click</span>
              </div>
            </div>
          </div>

          {/* Right Hairline-Separated Engagement Principles */}
          <div ref={pillarsRef} className="lg:col-span-7 border-t border-white/12">
            {WHY_US_PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                data-pillar-row
                className="group relative py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline will-change-transform"
              >
                <span className="sm:col-span-2 font-mono text-xs text-[#00C2A8] tabular-nums transition-transform duration-300 group-hover:translate-x-1">
                  {pillar.index}
                </span>
                <div className="sm:col-span-10 space-y-2 transition-transform duration-300 group-hover:translate-x-1">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white group-hover:text-[#00C2A8] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/65 leading-relaxed max-w-xl">
                    {pillar.body}
                  </p>
                </div>
                <span
                  data-pillar-line
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 inset-x-0 h-[1px] bg-white/12 group-hover:bg-[#00C2A8]/50 origin-left transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
