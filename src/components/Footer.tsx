import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { gsap } from '../utils/gsapSetup';
import { KineticText } from './motion/KineticLink';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onSelectServiceFromFooter: (serviceId: string) => void;
}

type LegalDoc = 'privacy' | 'terms' | null;

export function Footer({ onNavigateSection, onSelectServiceFromFooter }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const footerInnerRef = useRef<HTMLDivElement>(null);
  const [legalDoc, setLegalDoc] = useState<LegalDoc>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const inner = footerInnerRef.current;
    const footer = footerRef.current;
    if (!inner || !footer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { y: 30, clipPath: 'inset(6% 0% 0% 0%)' },
        {
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            end: 'bottom 2%',
            toggleActions: 'play none play none',
          },
        },
      );
    }, footerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer
      data-nav-theme="dark"
      ref={footerRef}
      className="bg-black text-white pt-20 sm:pt-24 pb-10 border-t border-white/10 overflow-hidden"
    >
      <div
        ref={footerInnerRef}
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 will-change-transform"
      >
        {/* Top Row matching NK Studio Footer: Oversized /arkon® left + Mission Statement & Contact Links right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 sm:pb-20 items-start">
          <div className="lg:col-span-6">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSection('hero');
              }}
              className="inline-flex items-start font-display font-bold tracking-[-0.045em] text-white leading-none"
              style={{ fontSize: 'clamp(3.25rem, 6.8vw, 6.25rem)' }}
            >
              <span>/arkon</span>
              <span className="text-xl sm:text-2xl ml-1 mt-1 font-medium text-[#00C2A8]">&reg;</span>
            </a>
          </div>

          <div className="lg:col-span-6 lg:max-w-lg space-y-6">
            <p className="text-xl sm:text-2xl font-display font-medium tracking-tight text-white leading-snug">
              We create clarity. Partnering with ambitious teams in moments of transformation
              and scale.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium uppercase tracking-[0.08em]">
              <a
                href="mailto:hello@arkon.studio"
                className="text-white/80 hover:text-[#00C2A8] pb-0.5 border-b border-white/35 hover:border-[#00C2A8] transition-colors"
              >
                HELLO@ARKON.STUDIO
              </a>
              <button
                type="button"
                onClick={() => onNavigateSection('contact')}
                className="text-white/80 hover:text-[#00C2A8] pb-0.5 border-b border-white/35 hover:border-[#00C2A8] transition-colors cursor-pointer"
              >
                LET&apos;S TALK
              </button>
            </div>
          </div>
        </div>

        {/* Middle Row: /arkon.news Briefing Left + 5 Uppercase Directory Columns Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12 sm:py-16 border-t border-white/12">
          <div className="lg:col-span-4 space-y-5">
            <div>
              <div className="font-display text-lg font-semibold text-white">/arkon.news</div>
              <p className="mt-2 text-xs text-white/55 leading-relaxed max-w-xs">
                Our quarterly dispatch on enterprise architecture, applied intelligence, and
                systems design. No filler, no noise.
              </p>
            </div>

            {newsletterSubscribed ? (
              <div className="text-xs font-mono text-[#00C2A8] py-2">
                Subscribed to quarterly /arkon.news dispatch.
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex items-center border-b border-white/25 focus-within:border-[#00C2A8] pb-2 max-w-xs transition-colors"
              >
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Email address for newsletter
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-transparent text-xs text-white placeholder:text-white/40 focus:outline-none flex-1 pr-2"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="text-[11px] font-medium uppercase tracking-[0.08em] text-white hover:text-[#00C2A8] inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>JOIN</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-[11px] uppercase tracking-[0.07em]">
            <div className="space-y-3">
              <div className="text-white/40 font-semibold">COMPANY</div>
              <ul className="space-y-2 text-white/80">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('studio')}
                    className="hover:text-[#00C2A8] transition-colors cursor-pointer"
                  >
                    Studio
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('method')}
                    className="hover:text-[#00C2A8] transition-colors cursor-pointer"
                  >
                    Method
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('insights')}
                    className="hover:text-[#00C2A8] transition-colors cursor-pointer"
                  >
                    Insights
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-white/40 font-semibold">SERVICES</div>
              <ul className="space-y-2 text-white/80">
                {[
                  { id: 'it-consulting', label: 'Strategy' },
                  { id: 'cybersecurity', label: 'Cybersecurity' },
                  { id: 'ai-ml', label: 'Applied AI' },
                  { id: 'software-dev', label: 'Platforms' },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectServiceFromFooter(item.id)}
                      className="hover:text-[#00C2A8] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-white/40 font-semibold">PROGRAMS</div>
              <ul className="space-y-2 text-white/80">
                {['Advisory', 'Transformation', 'Flagships', 'Architecture'].map((label) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => onNavigateSection('programs')}
                      className="hover:text-[#00C2A8] transition-colors cursor-pointer"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-white/40 font-semibold">EXPLORE</div>
              <ul className="space-y-2 text-white/80">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('impact')}
                    className="hover:text-[#00C2A8] transition-colors cursor-pointer"
                  >
                    Impact
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('projects')}
                    className="hover:text-[#00C2A8] transition-colors cursor-pointer"
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('testimonials')}
                    className="hover:text-[#00C2A8] transition-colors cursor-pointer"
                  >
                    Voices
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-white/40 font-semibold">CONNECT</div>
              <ul className="space-y-2 text-white/80">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('contact')}
                    className="hover:text-[#00C2A8] transition-colors cursor-pointer"
                  >
                    Let&apos;s Talk
                  </button>
                </li>
                <li>
                  <a href="mailto:hello@arkon.studio" className="hover:text-[#00C2A8] transition-colors">
                    Email
                  </a>
                </li>
                <li>
                  <span className="text-white/45">Zurich · London</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Strip & Social Links matching NK Studio frame 00:34 */}
        <div className="pt-8 border-t border-white/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] uppercase tracking-[0.08em] text-white/45">
          <div className="flex flex-wrap items-center gap-6">
            <span>&copy; 2026 ARKON STUDIO</span>
            <button
              type="button"
              onClick={() => setLegalDoc('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              PRIVACY POLICY
            </button>
            <button
              type="button"
              onClick={() => setLegalDoc('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              TERMS OF SERVICE
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pr-0 sm:pr-28">
            {['LINKEDIN', 'GITHUB', 'DRIBBBLE', 'INSTAGRAM'].map((social) => (
              <button
                key={social}
                type="button"
                onClick={() => onNavigateSection('contact')}
                className="group inline-flex text-white/60 hover:text-[#00C2A8] transition-colors cursor-pointer"
              >
                <KineticText>{social}</KineticText>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Information Modal */}
      <AnimatePresence>
        {legalDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLegalDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="legal-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0E0E10] text-white border border-white/15 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3
                  id="legal-modal-title"
                  className="font-display text-2xl font-semibold text-white"
                >
                  {legalDoc === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </h3>
                <button
                  type="button"
                  onClick={() => setLegalDoc(null)}
                  aria-label="Close legal notice"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-[#00C2A8] hover:text-[#050505] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                {legalDoc === 'privacy'
                  ? 'This studio showcase collects contact inquiry and newsletter dispatch details solely to respond to prospective consulting requests. Replace this notice with your jurisdiction-specific privacy policy before production launch.'
                  : 'All project concepts, partner marks, impact metrics, and collaborator quotes on this site are provided as demonstration studio placeholders. Replace with formal terms of service prior to public launch.'}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setLegalDoc(null)}
                  className="px-5 py-2 rounded-full bg-[#00C2A8] text-[#050505] text-xs font-semibold uppercase tracking-[0.07em] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
