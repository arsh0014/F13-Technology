import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { HEADER_NAV_ITEMS } from '../data/siteContent';
import { KineticText } from './motion/KineticLink';

interface NavbarProps {
  introComplete?: boolean;
  onNavigateSection: (sectionId: string) => void;
  onOpenMenu: () => void;
  menuOpen: boolean;
}

export function Navbar({
  introComplete = true,
  onNavigateSection,
  onOpenMenu,
  menuOpen,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [topOverDark, setTopOverDark] = useState(false);
  const [bottomOverDark, setBottomOverDark] = useState(false);

  useEffect(() => {
    const sampleSurfaceTheme = () => {
      const y = window.scrollY;
      setScrolled(y > 48);

      const darkSections = document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]');
      const topProbeY = 32;
      const bottomProbeY = Math.max(120, window.innerHeight - 36);
      let isTopDark = false;
      let isBottomDark = false;

      darkSections.forEach((sec) => {
        if (sec.getAttribute('data-nav-active') === 'false') {
          return;
        }
        const rect = sec.getBoundingClientRect();
        const isBottomActive = sec.getAttribute('data-nav-bottom-active') !== 'false';
        if (rect.top <= topProbeY && rect.bottom >= topProbeY) {
          isTopDark = true;
        }
        if (isBottomActive && rect.top <= bottomProbeY && rect.bottom >= bottomProbeY) {
          isBottomDark = true;
        }
      });

      setTopOverDark(isTopDark);
      setBottomOverDark(isBottomDark);
    };

    sampleSurfaceTheme();
    window.addEventListener('scroll', sampleSurfaceTheme, { passive: true });
    window.addEventListener('resize', sampleSurfaceTheme, { passive: true });
    window.addEventListener('arkon:nav-theme-sync', sampleSurfaceTheme);
    return () => {
      window.removeEventListener('scroll', sampleSurfaceTheme);
      window.removeEventListener('resize', sampleSurfaceTheme);
      window.removeEventListener('arkon:nav-theme-sync', sampleSurfaceTheme);
    };
  }, []);

  const textTone = topOverDark ? 'text-white' : 'text-[#0A0A0A]';
  const mutedTone = topOverDark
    ? 'text-white/75 hover:text-white'
    : 'text-[#0A0A0A]/80 hover:text-[#0A0A0A]';
  const borderTone = topOverDark
    ? 'border-white/70 hover:border-white'
    : 'border-[#0A0A0A]/75 hover:border-[#0A0A0A]';
  const headerSurface = scrolled
    ? topOverDark
      ? 'bg-[#050505]/78 backdrop-blur-md'
      : 'bg-white/82 backdrop-blur-md'
    : 'bg-transparent';

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={introComplete ? { y: 0, opacity: 1 } : { y: -16, opacity: 0 }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-40 pointer-events-none transition-colors duration-300 ${textTone} ${headerSurface}`}
      >
        <div className="w-full px-5 sm:px-8 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Extreme Left: Minimal /arkon wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('hero');
            }}
            className="pointer-events-auto group font-display text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00C2A8]"
          >
            <KineticText>
              <span className="inline-flex items-baseline">
                <span>/arkon</span>
              </span>
            </KineticText>
          </a>

          {/* Center Inline Small Uppercase Nav (visible at top hero, collapses into MENU after scroll) */}
          <nav
            aria-label="Primary navigation"
            className={`hidden lg:flex items-center gap-6 xl:gap-8 transition-all duration-300 ${
              scrolled
                ? 'opacity-0 -translate-y-2 pointer-events-none'
                : 'opacity-100 translate-y-0 pointer-events-auto'
            }`}
          >
            {HEADER_NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection(item.id);
                }}
                className={`group text-[11px] font-medium uppercase tracking-[0.07em] whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00C2A8] ${mutedTone}`}
              >
                <KineticText>{item.label}</KineticText>
              </a>
            ))}
          </nav>

          {/* Extreme Right: Compact uppercase LET'S TALK + MENU toggle */}
          <div className="pointer-events-auto flex items-center gap-5 sm:gap-7 shrink-0">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSection('contact');
              }}
              className={`group hidden sm:inline-block text-[11px] font-medium uppercase tracking-[0.07em] pb-0.5 border-b whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00C2A8] ${borderTone}`}
            >
              <KineticText>LET&apos;S TALK</KineticText>
            </a>

            <button
              type="button"
              onClick={onOpenMenu}
              aria-expanded={menuOpen}
              aria-label="Open navigation menu"
              className={`group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.07em] pb-0.5 border-b cursor-pointer whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00C2A8] ${
                scrolled ? 'lg:inline-flex' : 'lg:hidden'
              } ${borderTone}`}
            >
              <KineticText>MENU</KineticText>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fixed bottom-right subtle uppercase BACK TO TOP control with independent bottom surface detection */}
      <button
        type="button"
        onClick={() => onNavigateSection('hero')}
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-10 z-30 hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] pb-0.5 border-b cursor-pointer transition-all duration-300 ${
          bottomOverDark
            ? 'text-white/80 hover:text-[#00C2A8] border-white/45 hover:border-[#00C2A8]'
            : 'text-[#0A0A0A]/80 hover:text-[#008774] border-[#0A0A0A]/45 hover:border-[#008774]'
        } ${
          scrolled && !menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <span>BACK TO TOP</span>
        <ArrowUp className="w-3 h-3" aria-hidden="true" />
      </button>
    </>
  );
}
