import { PARTNER_PLACEHOLDERS } from '../data/siteContent';
import { SplitText } from './motion/SplitText';

interface BrandStorySectionProps {
  introComplete: boolean;
}

/**
 * Focused dark editorial credentials & enterprise philosophy band.
 * Keeps dedicated Three.js particle compute budget centered cleanly on DigitalParticleHeroCanvas.
 */
export function BrandStorySection({ introComplete }: BrandStorySectionProps) {
  return (
    <section
      data-nav-theme="dark"
      aria-label="Enterprise transformation philosophy and partner network"
      className="relative w-full bg-[#050505] text-white flex flex-col justify-between overflow-hidden pt-20 sm:pt-28 pb-16 sm:pb-20 px-5 sm:px-8"
    >
      <div className="relative z-10 max-w-5xl w-full mx-auto text-center py-8 sm:py-12">
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#00C2A8] mb-4">
          / Philosophy &amp; Enterprise Partners
        </div>
        <h2
          className="font-display font-semibold tracking-[-0.045em] text-white leading-[0.95] [text-wrap:balance]"
          style={{ fontSize: 'clamp(2.6rem, 7vw, 5.75rem)' }}
        >
          <SplitText
            as="span"
            text="We elevate"
            mode="words"
            ready={introComplete}
            className="block"
          />
          <SplitText
            as="span"
            text="ambitious teams"
            accentSuffix="."
            mode="words"
            ready={introComplete}
            className="block"
          />
        </h2>

        <p className="mt-6 sm:mt-7 text-sm sm:text-base text-white/75 max-w-md mx-auto leading-relaxed">
          We define what makes every platform unmistakable—uniting systems architecture,
          security rigor, and digital experience under one roof.
        </p>
      </div>

      {/* Subtle partner & credential strip anchored cleanly at the bottom */}
      <div className="relative z-10 max-w-[1360px] w-full mx-auto pt-8 border-t border-white/12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <p className="text-xs text-white/55 max-w-xs">
          / Trusted by leadership across multi-region transformation programs and digital systems.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {PARTNER_PLACEHOLDERS.map((partner) => (
            <div key={partner.id} className="text-left">
              <div className="text-xs font-semibold tracking-wide text-white/85">
                {partner.name}
              </div>
              <div className="text-[10px] uppercase tracking-[0.06em] text-white/45 mt-0.5">
                {partner.sector}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
