import { AnimatePresence, motion } from 'motion/react';
import { BrandWordmark } from '../BrandWordmark';

interface PageTransitionCurtainProps {
  isActive: boolean;
  targetLabel: string;
}

export function PageTransitionCurtain({ isActive, targetLabel }: PageTransitionCurtainProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[65] pointer-events-none"
        >
          {/* Leading Teal Accent Edge */}
          <motion.div
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.44, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-[#00C2A8]"
          />

          {/* Primary Obsidian Architectural Curtain */}
          <motion.div
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.42, delay: 0.04, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-[#050505] text-white flex items-center justify-center"
          >
            <div className="text-center space-y-3 overflow-hidden px-6">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.28, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#00C2A8]"
              >
                <BrandWordmark tone="light" />
              </motion.div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-105%' }}
                  transition={{ duration: 0.34, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight"
                >
                  {targetLabel}
                </motion.div>
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.36, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto h-[1px] w-28 bg-[#00C2A8] origin-left"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
