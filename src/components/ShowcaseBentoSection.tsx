import { useEffect, useRef } from 'react';
import { IMAGES } from '../data/siteContent';
import { gsap } from '../utils/gsapSetup';
import { ResilientImage } from './ResilientImage';
import { ImageMaskReveal } from './motion/ImageMaskReveal';

interface ShowcaseBentoSectionProps {
  onInspectProjects: () => void;
}

export function ShowcaseBentoSection({ onInspectProjects }: ShowcaseBentoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const midWideRef = useRef<HTMLDivElement>(null);
  const botRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (topRowRef.current) {
        gsap.fromTo(
          topRowRef.current.children,
          { y: 28 },
          {
            y: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: topRowRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
      if (midWideRef.current) {
        gsap.fromTo(
          midWideRef.current,
          { scale: 0.96 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: midWideRef.current,
              start: 'top 90%',
              end: 'center center',
              scrub: true,
            },
          },
        );
      }
      if (botRowRef.current) {
        gsap.fromTo(
          botRowRef.current.children,
          { y: 22 },
          {
            y: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: botRowRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="light"
      aria-label="Visual work and architectural capabilities showcase"
      className="bg-white pt-16 sm:pt-24 lg:pt-28 pb-20 sm:pb-28 lg:pb-36 px-4 sm:px-8 lg:px-10 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto space-y-5 sm:space-y-6">
        {/* Top Row: 3 Editorial Compositions matching NK Studio bento rhythm */}
        <div ref={topRowRef} className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          <button
            type="button"
            data-cursor-label="Explore Work"
            onClick={onInspectProjects}
            className="md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4F4F2] group cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C2A8]"
          >
            <ImageMaskReveal direction="up" parallax className="w-full h-full">
              <ResilientImage
                src={IMAGES.bentoWorkspace}
                alt="Sunlit architectural desk with dark analytics laptop interface"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </ImageMaskReveal>
          </button>

          <button
            type="button"
            data-cursor-label="Explore Work"
            onClick={onInspectProjects}
            className="md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4F4F2] group cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C2A8]"
          >
            <ImageMaskReveal direction="center" parallax className="w-full h-full">
              <ResilientImage
                src={IMAGES.archMonolith}
                alt="Architectural limestone and dark bronze glass building facade"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </ImageMaskReveal>
          </button>

          <button
            type="button"
            data-cursor-label="Explore Work"
            onClick={onInspectProjects}
            className="md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4F4F2] group cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C2A8]"
          >
            <ImageMaskReveal direction="up" parallax className="w-full h-full">
              <ResilientImage
                src={IMAGES.productMockup}
                alt="Minimalist digital fintech mobile mockup floating over travertine pedestal"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </ImageMaskReveal>
          </button>
        </div>

        {/* Center Wide Flagship Product Canvas + Tactile Studio Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <div ref={midWideRef} className="lg:col-span-7 will-change-transform">
            <button
              type="button"
              data-cursor-label="View Showcase"
              onClick={onInspectProjects}
              className="w-full h-full min-h-[300px] sm:min-h-[420px] rounded-2xl overflow-hidden bg-[#0E0E10] group cursor-pointer block relative text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C2A8]"
            >
              <ImageMaskReveal direction="left" parallax className="w-full h-full">
                <ResilientImage
                  src={IMAGES.laptopPlatform}
                  alt="Matte space-black enterprise workstation showing live performance telemetry"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </ImageMaskReveal>
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-white pointer-events-none">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/75">
                  / Flagship Systems Architecture
                </span>
                <span className="text-[11px] uppercase tracking-[0.08em] text-[#00C2A8]">
                  Live Concept
                </span>
              </div>
            </button>
          </div>

          <div ref={botRowRef} className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-6">
            <button
              type="button"
              data-cursor-label="View Engineering"
              onClick={onInspectProjects}
              className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#141416] group cursor-pointer text-left"
            >
              <ImageMaskReveal direction="up" parallax className="w-full h-full">
                <ResilientImage
                  src={IMAGES.softwareDev}
                  alt="Senior engineering desk with curved ultra-wide telemetry display"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </ImageMaskReveal>
            </button>

            <button
              type="button"
              data-cursor-label="View Intelligence"
              onClick={onInspectProjects}
              className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#0A0A0C] group cursor-pointer text-left"
            >
              <ImageMaskReveal direction="center" parallax className="w-full h-full">
                <ResilientImage
                  src={IMAGES.aiVisual}
                  alt="Refracted fluted glass prism with emerald AI topology waves"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </ImageMaskReveal>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
