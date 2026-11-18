import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import awsLogo from '../assets/partners/aws.png';
import dropboxLogo from '../assets/partners/dropbox.png';
import fortinetLogo from '../assets/partners/fortinet.png';
import lenovoLogo from '../assets/partners/lenovo.png';
import microsoftLogo from '../assets/partners/microsoft.png';
import vmwareLogo from '../assets/partners/vmware.png';
import { ScrollTrigger, gsap } from '../utils/gsapSetup';
import { computeScrollWipeState } from '../utils/particleWaveConfig';
import { DigitalParticleHeroCanvas } from './DigitalParticleHeroCanvas';
import { KineticText } from './motion/KineticLink';
import { SplitText } from './motion/SplitText';

const TECH_GIANT_PARTNERS = [
  { id: 'aws', name: 'AWS Partner Network', src: awsLogo },
  { id: 'microsoft', name: 'Microsoft Partner Network', src: microsoftLogo },
  { id: 'vmware', name: 'VMware Partner', src: vmwareLogo },
  { id: 'lenovo', name: 'Lenovo PCG Partner', src: lenovoLogo },
  { id: 'fortinet', name: 'Fortinet Authorized Partner', src: fortinetLogo },
  { id: 'dropbox', name: 'Dropbox Select Partner', src: dropboxLogo },
];

const MARQUEE_PARTNERS = [
  ...TECH_GIANT_PARTNERS,
  ...TECH_GIANT_PARTNERS,
  ...TECH_GIANT_PARTNERS,
  ...TECH_GIANT_PARTNERS,
];

interface CinematicHeroSequenceProps {
  introComplete: boolean;
  menuOpen: boolean;
  onExploreImpact: () => void;
  onRequestScrollToY: (scrollY: number) => void;
}

export function CinematicHeroSequence({
  introComplete,
  menuOpen,
  onExploreImpact,
  onRequestScrollToY,
}: CinematicHeroSequenceProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const whiteLayerRef = useRef<HTMLElement>(null);
  const whiteContentRef = useRef<HTMLDivElement>(null);
  const whiteStatsRef = useRef<HTMLDivElement>(null);
  const whiteLeadRef = useRef<HTMLParagraphElement>(null);
  const whiteCtaRef = useRef<HTMLButtonElement>(null);

  const blackLayerRef = useRef<HTMLElement>(null);
  const blackEdgeLineRef = useRef<HTMLDivElement>(null);
  const blackLine1Ref = useRef<HTMLSpanElement>(null);
  const blackLine2Ref = useRef<HTMLSpanElement>(null);
  const blackSubRef = useRef<HTMLDivElement>(null);

  const wipeProgressRef = useRef(0);
  const pinEndScrollRef = useRef<number | null>(null);

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const applyWipeState = useCallback((rawProgress: number) => {
    const state = computeScrollWipeState(rawProgress);
    wipeProgressRef.current = state.progress;

    if (whiteContentRef.current) {
      whiteContentRef.current.style.transform = `translate3d(0, ${state.whiteYOffset}px, 0) scale(${state.whiteScale})`;
      whiteContentRef.current.style.opacity = String(state.whiteOpacity);
    }

    if (blackLayerRef.current) {
      blackLayerRef.current.style.clipPath = `inset(${state.clipInsetTopPercent}% 0% 0% 0%)`;
      const nextTopDark = state.navDarkActive ? 'true' : 'false';
      const nextBotDark = state.bottomNavDarkActive ? 'true' : 'false';
      const prevTopDark = blackLayerRef.current.getAttribute('data-nav-active');
      const prevBotDark = blackLayerRef.current.getAttribute('data-nav-bottom-active');

      if (prevTopDark !== nextTopDark || prevBotDark !== nextBotDark) {
        blackLayerRef.current.setAttribute('data-nav-active', nextTopDark);
        blackLayerRef.current.setAttribute('data-nav-bottom-active', nextBotDark);
        window.dispatchEvent(new CustomEvent('arkon:nav-theme-sync'));
      }
      blackLayerRef.current.setAttribute('data-wipe-progress', state.progress.toFixed(3));
    }

    if (blackEdgeLineRef.current) {
      const edgeVisible = state.clipInsetTopPercent > 0.5 && state.clipInsetTopPercent < 99.5;
      blackEdgeLineRef.current.style.opacity = edgeVisible ? '1' : '0';
      blackEdgeLineRef.current.style.top = `${state.clipInsetTopPercent}%`;
    }

    // Smooth upward line-mask choreography for Giant Black Hero Typography
    const p1 = Math.max(0, Math.min(1, state.headlineRevealProgress * 1.18));
    const p2 = Math.max(0, Math.min(1, (state.headlineRevealProgress - 0.14) * 1.25));
    const pSub = Math.max(0, Math.min(1, (state.headlineRevealProgress - 0.32) * 1.45));

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const e1 = easeOut(p1);
    const e2 = easeOut(p2);
    const eSub = easeOut(pSub);

    if (blackLine1Ref.current) {
      blackLine1Ref.current.style.transform = `translate3d(0, ${(1 - e1) * 108}%, 0)`;
    }
    if (blackLine2Ref.current) {
      blackLine2Ref.current.style.transform = `translate3d(0, ${(1 - e2) * 108}%, 0)`;
    }
    if (blackSubRef.current) {
      blackSubRef.current.style.opacity = String(eSub);
      blackSubRef.current.style.transform = `translate3d(0, ${(1 - eSub) * 20}px, 0)`;
    }
  }, []);

  // White Editorial opening staggered entrance
  useEffect(() => {
    if (!introComplete) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      if (whiteLeadRef.current) {
        tl.fromTo(
          whiteLeadRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.58, ease: 'power3.out' },
          0.18,
        );
      }
      if (whiteCtaRef.current) {
        tl.fromTo(
          whiteCtaRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          0.26,
        );
      }
      if (whiteStatsRef.current) {
        const cols = whiteStatsRef.current.querySelectorAll('[data-hero-stat]');
        tl.fromTo(
          cols,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.52, stagger: 0.06, ease: 'power3.out' },
          0.3,
        );
      }
    }, whiteLayerRef);

    return () => {
      ctx.revert();
    };
  }, [introComplete]);

  // Pinned GSAP ScrollTrigger White-to-Black Clip-Path Wipe
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMqChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onMqChange);

    if (mq.matches) {
      setReducedMotion(true);
      applyWipeState(1);
      return () => {
        mq.removeEventListener('change', onMqChange);
      };
    }

    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) {
      return () => {
        mq.removeEventListener('change', onMqChange);
      };
    }

    applyWipeState(0);

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 1.15)}`,
        pin: stage,
        pinSpacing: true,
        scrub: 0.35,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          pinEndScrollRef.current = self.end;
          applyWipeState(self.progress);
        },
        onUpdate: (self) => {
          pinEndScrollRef.current = self.end;
          applyWipeState(self.progress);
        },
      });
      pinEndScrollRef.current = trigger.end;
    }, wrapperRef);

    return () => {
      ctx.revert();
      mq.removeEventListener('change', onMqChange);
    };
  }, [applyWipeState]);

  const handleRevealDigitalStage = () => {
    if (reducedMotion) {
      document.getElementById('digital-hero')?.scrollIntoView({ behavior: 'auto' });
      return;
    }
    const targetY =
      pinEndScrollRef.current ?? Math.round(window.innerHeight * 1.12);
    onRequestScrollToY(targetY);
  };

  return (
    <div ref={wrapperRef} id="hero" className="relative w-full overflow-x-clip">
      <div
        ref={stageRef}
        className={
          reducedMotion
            ? 'relative w-full'
            : 'relative w-full h-[100svh] min-h-[660px] overflow-hidden bg-white'
        }
      >
        {/* PART 1: WHITE EDITORIAL SECTION */}
        <section
          ref={whiteLayerRef}
          data-nav-theme="light"
          aria-label="Arkon editorial introduction"
          className={
            reducedMotion
              ? 'relative w-full min-h-[88vh] bg-white text-[#0A0A0A] flex flex-col justify-between pt-24 sm:pt-28 pb-12 sm:pb-14 px-5 sm:px-8 lg:px-12'
              : 'relative w-full h-full bg-white text-[#0A0A0A] flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-12 px-5 sm:px-8 lg:px-12'
          }
        >
          {/* Minimal architectural background grid lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(10,10,10,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.035) 1px, transparent 1px)',
              backgroundSize: '96px 96px',
            }}
          />

          <div
            ref={whiteContentRef}
            className="relative z-10 max-w-[1360px] w-full mx-auto flex-1 flex flex-col justify-center items-center will-change-transform"
          >
            {/* Center Oversized Editorial Statement */}
            <div className="text-center flex flex-col items-center max-w-4xl mx-auto my-auto py-6">
              <h1
                className="font-display font-semibold tracking-[-0.045em] text-[#0A0A0A] leading-[0.94] [text-wrap:balance]"
                style={{ fontSize: 'clamp(2.55rem, 6.8vw, 6.45rem)' }}
              >
                <SplitText
                  as="span"
                  text="Transforming Your"
                  mode="words"
                  triggerOnScroll={false}
                  ready={introComplete}
                  delay={0.04}
                  className="block"
                />
                <SplitText
                  as="span"
                  text="Business Into A Digital"
                  mode="words"
                  triggerOnScroll={false}
                  ready={introComplete}
                  delay={0.09}
                  className="block"
                />
                <SplitText
                  as="span"
                  text="Enterprise"
                  accentSuffix=" ."
                  mode="words"
                  triggerOnScroll={false}
                  ready={introComplete}
                  delay={0.14}
                  className="block"
                />
              </h1>

              <p
                ref={whiteLeadRef}
                className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-[17px] text-[#404040] max-w-xl mx-auto leading-relaxed will-change-transform"
              >
                We are an independent creative technology and IT consulting studio partnering
                with ambitious leaders to engineer resilient systems, intelligent platforms, and
                enduring digital experiences.
              </p>

              <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-6">
                <button
                  ref={whiteCtaRef}
                  type="button"
                  data-testid="white-hero-cta"
                  onClick={handleRevealDigitalStage}
                  className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#0A0A0A] pb-1 border-b border-[#0A0A0A] hover:text-[#008774] hover:border-[#008774] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <KineticText>ENTER DIGITAL REALITY</KineticText>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PART 2 EDGE ACCENT LINE (Glides smoothly along clip-path wipe seam) */}
        {!reducedMotion && (
          <div
            ref={blackEdgeLineRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 z-20 h-[1px] bg-gradient-to-r from-transparent via-[#00E5A3] to-transparent opacity-0"
            style={{ top: '100%' }}
          />
        )}

        {/* PART 3–6: FULL-SCREEN BLACK INTERACTIVE 3D DIGITAL HERO */}
        <section
          ref={blackLayerRef}
          id="digital-hero"
          data-testid="black-digital-hero"
          data-nav-theme="dark"
          data-nav-active={reducedMotion ? 'true' : 'false'}
          data-nav-bottom-active={reducedMotion ? 'true' : 'false'}
          data-wipe-progress={reducedMotion ? '1.000' : '0.000'}
          aria-label="Interactive Three.js digital wave and engineering statement"
          className={
            reducedMotion
              ? 'relative w-full min-h-[100svh] bg-black text-white flex flex-col justify-between items-center overflow-hidden px-4 sm:px-8 pt-24 pb-6 sm:pb-8'
              : 'absolute inset-0 z-10 w-full h-full bg-black text-white flex flex-col justify-between items-center overflow-hidden px-4 sm:px-8 pt-20 pb-5 sm:pb-7'
          }
          style={reducedMotion ? undefined : { clipPath: 'inset(100% 0% 0% 0%)' }}
        >
          {/* Full-screen 3D particle waves + original translucent green diagonal prism */}
          <DigitalParticleHeroCanvas active={introComplete && !menuOpen} />

          {/* Subtle top/bottom vignette to guarantee pure editorial readability */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.58)_100%)]"
          />

          {/* Top spacer to preserve breathing room under fixed navbar */}
          <div className="w-full h-8 sm:h-12 shrink-0 pointer-events-none" aria-hidden="true" />

          {/* Centered Giant Crisp White Editorial Typography */}
          <div className="relative z-10 max-w-5xl w-full mx-auto text-center pointer-events-none select-none my-auto px-4 py-4">
            <h2
              data-testid="black-hero-headline"
              className="font-display font-light tracking-[-0.035em] text-white leading-[1.05] [text-shadow:0_8px_36px_rgba(0,0,0,0.88)]"
              style={{ fontSize: 'clamp(2.35rem, 6.2vw, 5.5rem)' }}
            >
              <span className="block overflow-hidden py-1.5">
                <span
                  ref={blackLine1Ref}
                  className="block will-change-transform"
                  style={
                    reducedMotion
                      ? undefined
                      : { transform: 'translate3d(0, 108%, 0)' }
                  }
                >
                  We have cloud in our <span className="text-[#00A994]">DNA</span>. We believe in
                </span>
              </span>
              <span className="block overflow-hidden py-1.5">
                <span
                  ref={blackLine2Ref}
                  className="block will-change-transform"
                  style={
                    reducedMotion
                      ? undefined
                      : { transform: 'translate3d(0, 108%, 0)' }
                  }
                >
                  #MakingChangesHappen
                </span>
              </span>
            </h2>
          </div>

          {/* Sliding Tech Giants Partner Marquee Strip at Bottom (replaces move cursor cue) */}
          <div
            ref={blackSubRef}
            className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center pointer-events-auto will-change-transform pb-1 sm:pb-2 shrink-0"
            style={
              reducedMotion
                ? undefined
                : { opacity: 0, transform: 'translate3d(0, 20px, 0)' }
            }
          >
            <button
              type="button"
              onClick={onExploreImpact}
              className="group inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#00E5A3] hover:text-white transition-colors cursor-pointer mb-2.5 sm:mb-3"
            >
              <span>Partnered with the world’s largest tech giants:</span>
              <ArrowDown
                className="w-3 h-3 transition-transform duration-200 group-hover:translate-y-0.5 opacity-70 group-hover:opacity-100"
                aria-hidden="true"
              />
            </button>

            {/* Edge-faded horizontal track container */}
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex w-max items-center gap-3.5 sm:gap-5 animate-marquee hover:[animation-play-state:paused] py-1">
                {MARQUEE_PARTNERS.map((partner, index) => (
                  <div
                    key={`${partner.id}-${index}`}
                    className="flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white shadow-md shadow-black/60 border border-white/20 transition-all duration-300 hover:scale-105 hover:border-[#00E5A3]/50 shrink-0"
                  >
                    <img
                      src={partner.src}
                      alt={partner.name}
                      className="h-5 sm:h-6.5 w-auto object-contain select-none pointer-events-none"
                      loading="eager"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
