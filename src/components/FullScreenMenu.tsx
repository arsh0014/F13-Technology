import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { MENU_NAV_ITEMS } from '../data/siteContent';
import { ResilientImage } from './ResilientImage';
import { KineticText } from './motion/KineticLink';

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export function FullScreenMenu({
  isOpen,
  onClose,
  onNavigateSection,
}: FullScreenMenuProps) {
  const [hoveredIdx, setHoveredIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const activePreview = MENU_NAV_ITEMS[hoveredIdx] ?? MENU_NAV_ITEMS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.48, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen studio navigation"
          className="fixed inset-0 z-[75] bg-[#050505] text-white flex flex-col justify-between overflow-y-auto"
        >
          {/* Minimal Overlay Header */}
          <div className="w-full px-5 sm:px-8 lg:px-10 h-16 flex items-center justify-between shrink-0">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                onNavigateSection('hero');
              }}
              className="font-display text-xl font-bold tracking-tight text-white"
            >
              /arkon
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-white pb-0.5 border-b border-white/60 hover:border-[#00C2A8] hover:text-[#00C2A8] transition-colors cursor-pointer"
            >
              <span>CLOSE</span>
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Main Grid: Oversized Staggered Menu Typography + Live Editorial Preview & Contact */}
          <div className="max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center my-auto">
            <nav aria-label="Full screen menu links" className="lg:col-span-7 flex flex-col">
              {MENU_NAV_ITEMS.map((item, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <div
                    key={item.id}
                    className="overflow-hidden border-b border-white/10 last:border-b-0"
                  >
                    <motion.a
                      href={`#${item.id}`}
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '105%' }}
                      transition={{
                        delay: 0.08 + idx * 0.035,
                        duration: 0.44,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onFocus={() => setHoveredIdx(idx)}
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        onNavigateSection(item.id);
                      }}
                      className="group py-2.5 sm:py-3 flex items-baseline justify-between gap-6 cursor-pointer"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span
                          className={`font-mono text-xs tabular-nums transition-colors duration-200 ${
                            isHovered ? 'text-[#00C2A8]' : 'text-white/40'
                          }`}
                        >
                          {item.index}
                        </span>
                        <span
                          className={`font-display text-3xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.06] transition-all duration-200 ${
                            isHovered
                              ? 'text-[#00C2A8] translate-x-2'
                              : 'text-white group-hover:translate-x-2'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      <div className="hidden sm:flex items-center gap-3 text-xs uppercase tracking-[0.06em]">
                        <span
                          className={`transition-colors duration-200 ${
                            isHovered ? 'text-white' : 'text-white/45'
                          }`}
                        >
                          {item.tag}
                        </span>
                        <ArrowUpRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isHovered
                              ? 'text-[#00C2A8] translate-x-0.5 -translate-y-0.5'
                              : 'text-white/40'
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </motion.a>
                  </div>
                );
              })}
            </nav>

            {/* Right Column: Live Visual Hover Preview + Studio Details */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.4 }}
              className="lg:col-span-5 flex flex-col justify-between gap-8"
            >
              <div className="hidden lg:block space-y-3">
                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-900 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePreview.id}
                      initial={{ scale: 1.06, opacity: 0.65 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0.5 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full"
                    >
                      <ResilientImage
                        src={activePreview.previewImage}
                        alt={`${activePreview.label} preview`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-white/55">
                  <span>/ {activePreview.label}</span>
                  <span className="text-[#00C2A8]">{activePreview.tag}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/12 text-xs">
                <div className="space-y-2">
                  <div className="uppercase tracking-[0.08em] text-white/45">
                    Direct Contact
                  </div>
                  <div>
                    <a
                      href="mailto:hello@arkon.studio"
                      className="group inline-flex text-sm font-medium text-white hover:text-[#00C2A8] transition-colors"
                    >
                      <KineticText>hello@arkon.studio</KineticText>
                    </a>
                  </div>
                  <div className="font-mono text-white/60">+1 (555) 014-8900</div>
                  <div className="text-white/55">Zurich · London · New York</div>
                </div>

                <div className="space-y-2">
                  <div className="uppercase tracking-[0.08em] text-white/45">Connect</div>
                  <div className="flex flex-col gap-1.5 text-sm">
                    {['LinkedIn', 'GitHub', 'Dribbble', 'Instagram'].map((social) => (
                      <a
                        key={social}
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          onClose();
                          onNavigateSection('contact');
                        }}
                        className="group inline-flex items-center gap-1 text-white/80 hover:text-[#00C2A8] transition-colors w-fit"
                      >
                        <KineticText>{social}</KineticText>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="px-5 sm:px-8 lg:px-10 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.08em] text-white/45 shrink-0">
            <span>Arkon Technology &amp; Consulting</span>
            <span>Creative Direction · Systems Engineering</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
