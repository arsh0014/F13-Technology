import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { IMAGES, IMPACT_METRICS } from '../data/siteContent';
import { gsap } from '../utils/gsapSetup';
import { ResilientImage } from './ResilientImage';
import { KineticText } from './motion/KineticLink';
import { SplitText } from './motion/SplitText';

function ScrollAnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target);
      return;
    }

    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      gsap.fromTo(
        counter,
        { value: 0 },
        {
          value: target,
          duration: 1.25,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            once: true,
          },
          onUpdate: () => {
            setDisplay(Math.round(counter.value));
          },
        },
      );
    }, ref);

    return () => {
      ctx.revert();
    };
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

interface ImpactSectionProps {
  onViewResults: () => void;
}

export function ImpactSection({ onViewResults }: ImpactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageIntroRef = useRef<HTMLDivElement>(null);
  const impactCopyRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageIntro = imageIntroRef.current;
    const impactCopy = impactCopyRef.current;
    const cluster = clusterRef.current;
    const line = topLineRef.current;
    const grid = gridRef.current;
    if (
      !section ||
      !imageIntro ||
      !impactCopy ||
      !cluster ||
      !line ||
      !grid ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const clusterCards = cluster.querySelectorAll<HTMLElement>('[data-cluster-card]');

      // This is one shared cluster, not two versions that fade between each other.
      // It starts oversized in the centre and physically travels to its compact
      // place beside the heading as the visitor scrolls.
      gsap.set(impactCopy, { autoAlpha: 0, y: 24 });
      gsap.set(cluster, {
        xPercent: -50,
        yPercent: -50,
        gap: window.innerWidth < 640 ? 10 : 18,
      });
      gsap.set(clusterCards, {
        width: (index) => (window.innerWidth < 640 ? [224, 264, 224][index] : [440, 520, 440][index]),
        height: (index) => (window.innerWidth < 640 ? [264, 316, 264][index] : [530, 650, 530][index]),
      });

      const introTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: imageIntro,
          start: 'top top',
          end: '+=105%',
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
        },
      });

      introTimeline
        .to(
          cluster,
          {
            x: () => (window.innerWidth < 640 ? 0 : Math.min(window.innerWidth * 0.2, 300)),
            y: () => (window.innerWidth < 640 ? 105 : -42),
            gap: 8,
            ease: 'power3.inOut',
          },
          0,
        )
        .to(
          clusterCards,
          {
            width: (index) => (window.innerWidth < 640 ? [48, 56, 48][index] : [64, 80, 64][index]),
            height: window.innerWidth < 640 ? 48 : 64,
            ease: 'power3.inOut',
          },
          0,
        )
        .fromTo(
          impactCopy,
          { autoAlpha: 0, y: 42 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' },
          0.3,
        );

      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 95%',
            end: 'bottom 2%',
            toggleActions: 'play none play none',
          },
        },
      );

      const cols = grid.querySelectorAll('[data-impact-col]');
      gsap.fromTo(
        cols,
        { y: 18 },
        {
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
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
      id="impact"
      data-nav-theme="light"
      ref={sectionRef}
      aria-label="Clarity and impact metrics"
      className="relative scroll-mt-12 py-24 sm:py-32 lg:py-40 bg-white text-[#0A0A0A] overflow-hidden"
    >
      {/* Subtle isometric blueprint pattern behind the full composition. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(30deg, transparent 49.25%, rgba(10,10,10,0.09) 49.7%, rgba(10,10,10,0.09) 50.3%, transparent 50.75%), linear-gradient(150deg, transparent 49.25%, rgba(10,10,10,0.09) 49.7%, rgba(10,10,10,0.09) 50.3%, transparent 50.75%), linear-gradient(to right, rgba(10,10,10,0.06) 1px, transparent 1px)',
          backgroundSize: '176px 102px, 176px 102px, 88px 102px',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* The original three-card treatment is a single shared element throughout the scroll. */}
        <div
          ref={imageIntroRef}
          aria-label="Selected Arkon work"
          className="relative min-h-[100svh] flex items-center justify-center"
        >
          {/* Copy is underneath the cards at first, then becomes visible while they land beside it. */}
          <div ref={impactCopyRef} className="absolute inset-x-0 top-1/2 -translate-y-1/2 max-w-4xl mx-auto text-center">
            <h2
              className="font-display font-semibold tracking-[-0.045em] text-[#0A0A0A] leading-[0.95]"
              style={{ fontSize: 'clamp(3.2rem, 8.8vw, 7.75rem)' }}
            >
              <SplitText as="span" text="We bring" mode="words" className="block" />
              <SplitText as="span" text="clarity" accentSuffix="." mode="words" />
            </h2>

            <p className="mt-7 sm:mt-9 text-sm sm:text-base lg:text-[17px] text-[#525252] max-w-lg mx-auto leading-relaxed">
              Growth raises complex technical questions. We help align executive priorities and turn
              structural challenges into clear decisions, resilient platforms, and measurable velocity.
            </p>

            <button
              type="button"
              onClick={onViewResults}
              className="group mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#0A0A0A] pb-1 border-b border-[#0A0A0A] hover:text-[#009B86] hover:border-[#009B86] transition-colors cursor-pointer"
            >
              <KineticText>SEE OUR RESULTS</KineticText>
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </div>

          <div
            ref={clusterRef}
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-10 inline-flex items-start gap-2 motion-reduce:hidden"
          >
            <div data-cluster-card className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shadow-md rotate-[-3deg]">
              <ResilientImage src={IMAGES.heroStudio} alt="" className="w-full h-full object-cover" />
            </div>
            <div data-cluster-card className="w-14 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden shadow-md">
              <ResilientImage src={IMAGES.insightGlass} alt="" className="w-full h-full object-cover" />
            </div>
            <div data-cluster-card className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shadow-md rotate-[3deg]">
              <ResilientImage src={IMAGES.approachTeam} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Hairline Divider & Clean Editorial Numbers Strip matching 00:08-00:09 */}
        <div className="mt-20 sm:mt-24">
          <div
            ref={topLineRef}
            aria-hidden="true"
            className="h-[1px] w-full bg-[#0A0A0A]/12 origin-left will-change-transform"
          />

          <div
            ref={gridRef}
            className="pt-12 sm:pt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-3 text-xs text-[#525252] leading-relaxed max-w-[200px]">
              / What shifts when clear strategy meets production engineering.
            </div>

            <div className="lg:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {IMPACT_METRICS.map((metric) => (
                <div
                  key={metric.id}
                  data-impact-col
                  className="group space-y-2 will-change-transform"
                >
                  <div
                    className="font-display font-medium tracking-tight text-[#0A0A0A] leading-none transition-colors duration-200 group-hover:text-[#009B86]"
                    style={{ fontSize: 'clamp(2.5rem, 4.2vw, 3.6rem)' }}
                  >
                    <ScrollAnimatedCounter target={metric.value} suffix={metric.suffix} />
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.06em] font-medium text-[#0A0A0A]">
                    {metric.label}
                  </div>
                  <div className="text-xs text-[#737373]">{metric.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
