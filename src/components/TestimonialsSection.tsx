import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PARTNER_PLACEHOLDERS, TESTIMONIAL_PLACEHOLDERS } from '../data/siteContent';
import { getNextSlideIndex, getPrevSlideIndex } from '../utils/catalog';
import { gsap } from '../utils/gsapSetup';
import { getSwipeDirection } from '../utils/motionConfig';
import { SplitText } from './motion/SplitText';

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    x: dir > 0 ? 44 : -44,
    clipPath: dir > 0 ? 'inset(0% 0% 0% 12%)' : 'inset(0% 12% 0% 0%)',
  }),
  center: {
    x: 0,
    clipPath: 'inset(0% 0% 0% 0%)',
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -44 : 44,
    clipPath: dir > 0 ? 'inset(0% 12% 0% 0%)' : 'inset(0% 0% 0% 12%)',
  }),
};

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const pointerStartX = useRef<number | null>(null);
  const total = TESTIMONIAL_PLACEHOLDERS.length;
  const active = TESTIMONIAL_PLACEHOLDERS[index];

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { y: 24, clipPath: 'inset(8% 4% 8% 4%)' },
        {
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: frame,
            start: 'top 95%',
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

  const goNext = () => {
    setDirection(1);
    setIndex((curr) => getNextSlideIndex(curr, total));
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((curr) => getPrevSlideIndex(curr, total));
  };

  const goTo = (targetIdx: number) => {
    setDirection(targetIdx >= index ? 1 : -1);
    setIndex(targetIdx);
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    const swipe = getSwipeDirection(deltaX);
    if (swipe === 'next') goNext();
    if (swipe === 'prev') goPrev();
  };

  return (
    <section
      id="testimonials"
      data-nav-theme="light"
      ref={sectionRef}
      aria-label="Collaborator testimonials"
      className="scroll-mt-12 py-24 sm:py-32 lg:py-40 bg-white text-[#0A0A0A]"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* NK-style crisp monochrome partner wordmarks above quote */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pb-14 text-xs font-medium uppercase tracking-[0.09em] text-[#0A0A0A]/40">
          {PARTNER_PLACEHOLDERS.map((partner) => (
            <span key={partner.id}>{partner.name}</span>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#008774] mb-4">
            / Voices
          </div>
          <SplitText
            as="h2"
            text="From those who choose us"
            accentSuffix="."
            mode="words"
            className="font-display font-semibold tracking-[-0.04em] text-[#0A0A0A] leading-[0.98]"
            style={{ fontSize: 'clamp(2.5rem, 5.2vw, 4.5rem)' }}
          />
        </div>

        <div
          ref={frameRef}
          data-cursor-label="Swipe / Next"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="max-w-4xl mx-auto text-center select-none touch-pan-y will-change-transform"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              custom={direction}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <blockquote
                className="font-display font-medium text-[#0A0A0A] leading-[1.32] mx-auto"
                style={{ fontSize: 'clamp(1.35rem, 2.3vw, 2rem)' }}
              >
                &ldquo;{active.quote}&rdquo;
              </blockquote>

              <div className="space-y-1">
                <div className="text-sm font-semibold text-[#0A0A0A]">{active.name}</div>
                <div className="text-xs text-[#525252]">
                  {active.designation} · {active.company}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#008774] pt-1">
                  {active.context}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Centered Circular Author Markers + Prev/Next Controls matching NK Studio */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="w-9 h-9 rounded-full border border-[#0A0A0A]/20 flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2.5" aria-label="Slide selector">
              {TESTIMONIAL_PLACEHOLDERS.map((item, idx) => {
                const isActive = idx === index;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(idx)}
                    aria-label={`View testimonial ${idx + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`w-10 h-10 rounded-full font-display text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0A0A0A] text-white scale-110 ring-2 ring-[#00C2A8] ring-offset-2'
                        : 'bg-[#F3F3F0] text-[#525252] hover:bg-[#E5E5E0] hover:text-[#0A0A0A]'
                    }`}
                  >
                    {item.initials}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="w-9 h-9 rounded-full border border-[#0A0A0A]/20 flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
