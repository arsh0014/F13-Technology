import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PROCESS_STAGES } from '../data/siteContent';
import { gsap } from '../utils/gsapSetup';
import { SplitText } from './motion/SplitText';

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const current = PROCESS_STAGES[activeIndex];
  const progressFraction = (activeIndex + 1) / PROCESS_STAGES.length;

  useEffect(() => {
    const container = stepsRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (timelineTrackRef.current) {
        gsap.fromTo(
          timelineTrackRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'top 25%',
              scrub: true,
            },
          },
        );
      }

      const cards = container.querySelectorAll('[data-process-step]');
      gsap.fromTo(
        cards,
        {
          y: 22,
          rotationX: 10,
          transformPerspective: 850,
        },
        {
          y: 0,
          rotationX: 0,
          duration: 0.52,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 99%',
            end: 'bottom 2%',
            toggleActions: 'play none play none',
          },
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="method"
      data-nav-theme="dark"
      ref={sectionRef}
      className="scroll-mt-12 py-20 sm:py-28 lg:py-36 bg-[#050505] text-white border-t border-white/10"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-4xl mb-14 lg:mb-20">
          <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#00C2A8] mb-4">
            / Method · 5-Stage Delivery
          </div>
          <SplitText
            as="h2"
            text="From first idea to real scale"
            accentSuffix="."
            mode="words"
            className="font-display font-semibold tracking-[-0.04em] text-white leading-[0.98]"
            style={{ fontSize: 'clamp(2.5rem, 5.4vw, 4.75rem)' }}
          />
        </div>

        {/* Scrubbed Track + Interactive Stage Progress Line */}
        <div className="relative h-[1px] w-full mb-8 overflow-hidden">
          <div
            ref={timelineTrackRef}
            aria-hidden="true"
            className="absolute inset-0 bg-white/15 origin-left"
          />
          <motion.div
            className="relative z-10 h-full bg-[#00C2A8] origin-left"
            animate={{ scaleX: progressFraction }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Interactive 5-Stage Timeline */}
        <div
          ref={stepsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10 [perspective:900px]"
        >
          {PROCESS_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={stage.index}
                data-process-step
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-pressed={isActive}
                className={`relative overflow-hidden text-left p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C2A8] will-change-transform ${
                  isActive
                    ? 'text-[#050505] border-white'
                    : 'bg-[#0E0E10] text-white border-white/12 hover:border-white/35'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="process-active-bg"
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden="true"
                    className="absolute inset-0 bg-white pointer-events-none"
                  />
                )}
                <div className="relative z-10">
                  <div
                    className={`font-mono text-xs tabular-nums mb-3 ${
                      isActive ? 'text-[#008774] font-semibold' : 'text-[#00C2A8]'
                    }`}
                  >
                    {stage.index}
                  </div>
                  <div className="font-display text-xl font-semibold tracking-tight">
                    {stage.title}
                  </div>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isActive ? 'text-[#050505]/75' : 'text-white/60'
                    }`}
                  >
                    {stage.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Panel */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.index}
              initial={{ clipPath: 'inset(0% 0% 100% 0%)', y: 18 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
              exit={{ clipPath: 'inset(100% 0% 0% 0%)', y: -12 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 bg-[#0E0E10] border border-white/12 rounded-2xl"
            >
              <div className="lg:col-span-7 space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#00C2A8] tabular-nums">
                  Phase {current.index} — {current.title}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                  {current.summary}
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
                  {current.detail}
                </p>
              </div>
              <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-8 flex flex-col justify-center">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50 mb-4">
                  Stage Deliverables
                </h4>
                <ul className="space-y-3">
                  {current.artifacts.map((artifact, idx) => (
                    <motion.li
                      key={artifact}
                      initial={{ x: -14, clipPath: 'inset(0 100% 0 0)' }}
                      animate={{ x: 0, clipPath: 'inset(0 0% 0 0)' }}
                      transition={{
                        duration: 0.32,
                        delay: idx * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-sm sm:text-base font-medium text-white pb-2.5 border-b border-white/10 last:border-b-0"
                    >
                      {artifact}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
