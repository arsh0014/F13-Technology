import { ArrowRight } from 'lucide-react';
import { IMAGES } from '../data/siteContent';
import { ResilientImage } from './ResilientImage';
import { ImageMaskReveal } from './motion/ImageMaskReveal';
import { KineticText } from './motion/KineticLink';
import { SplitText } from './motion/SplitText';

interface StudioSectionProps {
  onStartConversation: () => void;
}

export function StudioSection({ onStartConversation }: StudioSectionProps) {
  return (
    <section
      id="studio"
      data-nav-theme="light"
      aria-label="Arkon studio culture and team"
      className="scroll-mt-12 py-20 sm:py-28 lg:py-36 bg-white text-[#0A0A0A] border-t border-[#0A0A0A]/10"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-5xl mx-auto mb-12 sm:mb-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#008774] mb-4">
            / Studio · Zurich · London · New York
          </div>
          <SplitText
            as="h2"
            text="People inspire us"
            accentSuffix="."
            mode="words"
            className="font-display font-semibold tracking-[-0.045em] text-[#0A0A0A] leading-[0.94] [text-wrap:balance]"
            style={{ fontSize: 'clamp(3rem, 8.2vw, 7.2rem)' }}
          />
          <p className="mt-6 text-sm sm:text-base text-[#525252] max-w-lg mx-auto leading-relaxed">
            Our studio operates without bureaucracy—small senior pods of systems architects,
            product designers, and engineers working directly alongside client leadership.
          </p>
        </div>

        {/* 2-Column Editorial Architectural Studio Diptych */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          <div className="lg:col-span-6 aspect-[16/11] rounded-2xl overflow-hidden bg-[#F4F4F2]">
            <ImageMaskReveal direction="up" parallax className="w-full h-full">
              <ResilientImage
                src={IMAGES.studioConference}
                alt="Senior technology architects collaborating in minimalist travertine studio conference room"
                className="w-full h-full object-cover"
              />
            </ImageMaskReveal>
          </div>
          <div className="lg:col-span-6 aspect-[16/11] rounded-2xl overflow-hidden bg-[#F4F4F2]">
            <ImageMaskReveal direction="center" parallax className="w-full h-full">
              <ResilientImage
                src={IMAGES.studioPod}
                alt="Architectural studio workspace bathed in crisp daylight with dark wood detailing"
                className="w-full h-full object-cover"
              />
            </ImageMaskReveal>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-[#0A0A0A]/10">
          <div className="text-xs sm:text-sm text-[#525252] max-w-md leading-relaxed">
            / Direct principal leadership from initial discovery through multi-region deployment.
          </div>
          <button
            type="button"
            onClick={onStartConversation}
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#0A0A0A] pb-1 border-b border-[#0A0A0A] hover:text-[#008774] hover:border-[#008774] transition-colors cursor-pointer w-fit"
          >
            <KineticText>START A CONVERSATION</KineticText>
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
