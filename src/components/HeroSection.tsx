import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from '../utils/gsapSetup';
import { HeroMonolithCanvas } from './HeroMonolithCanvas';
import { KineticText } from './motion/KineticLink';
import { SplitText } from './motion/SplitText';

interface HeroSectionProps {
  introComplete: boolean;
  onExploreImpact: () => void;
}

export function HeroSection({ introComplete, onExploreImpact }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !introComplete) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      if (leadRef.current) {
        tl.fromTo(
          leadRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          0.2,
        );
      }
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          0.3,
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [introComplete]);

  return (
    <section
      id="hero"
      data-nav-theme="light"
      ref={sectionRef}
      className="relative min-h-[82vh] sm:min-h-[88vh] w-full bg-white text-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 sm:pb-20 px-5 sm:px-8"
    >
      {/* Interactive 3D architectural terrain & wireframe monolith */}
      <HeroMonolithCanvas variant="light" active={introComplete} />

      {/* Centered Editorial Foreground with gentle radial clarity halo */}
      <div className="relative z-10 max-w-5xl w-full mx-auto text-center flex flex-col items-center py-6 sm:py-8 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.45)_52%,transparent_78%)]">
        <h1
          className="font-display font-semibold tracking-[-0.045em] text-[#0A0A0A] leading-[0.94] [text-wrap:balance]"
          style={{ fontSize: 'clamp(3.15rem, 9.2vw, 8.2rem)' }}
        >
          <SplitText
            as="span"
            text="Technology"
            mode="words"
            triggerOnScroll={false}
            ready={introComplete}
            delay={0.04}
            className="block"
          />
          <SplitText
            as="span"
            text="moves business"
            accentSuffix="."
            mode="words"
            triggerOnScroll={false}
            ready={introComplete}
            delay={0.12}
            className="block"
          />
        </h1>

        <p
          ref={leadRef}
          className="mt-7 sm:mt-9 text-sm sm:text-base lg:text-[17px] text-[#3F3F46] max-w-xl mx-auto leading-relaxed will-change-transform"
        >
          We are an independent creative technology and IT consulting studio. We partner with
          ambitious organizations in moments of growth and change—combining strategy,
          engineering, and digital craft to move businesses forward.
        </p>

        <button
          ref={ctaRef}
          type="button"
          onClick={onExploreImpact}
          className="group mt-7 sm:mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#0A0A0A] pb-1 border-b border-[#0A0A0A] hover:text-[#008774] hover:border-[#008774] transition-colors cursor-pointer whitespace-nowrap"
        >
          <KineticText>EXPLORE OUR IMPACT</KineticText>
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
}
