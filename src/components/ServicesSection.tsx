import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  Cloud,
  Code2,
  Compass,
  Database,
  Layers,
  Lock,
  MonitorSmartphone,
  ServerCog,
  Workflow,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SERVICES, type ServiceItem } from '../data/siteContent';
import { gsap } from '../utils/gsapSetup';
import { ResilientImage } from './ResilientImage';
import { KineticText } from './motion/KineticLink';
import { SplitText } from './motion/SplitText';

interface ServicesSectionProps {
  activeServiceId: string;
  onSelectActiveService: (id: string) => void;
  onInquireService: (serviceTitle: string) => void;
}

function ServiceIcon({ id }: { id: string }) {
  const cls = 'w-5 h-5 text-[#00C2A8]';
  switch (id) {
    case 'it-consulting':
      return <Compass className={cls} aria-hidden="true" />;
    case 'cybersecurity':
      return <Lock className={cls} aria-hidden="true" />;
    case 'web-design-dev':
      return <MonitorSmartphone className={cls} aria-hidden="true" />;
    case 'ai-ml':
      return <Bot className={cls} aria-hidden="true" />;
    case 'cloud-computing':
      return <Cloud className={cls} aria-hidden="true" />;
    case 'software-dev':
      return <Code2 className={cls} aria-hidden="true" />;
    case 'ui-ux-design':
      return <Layers className={cls} aria-hidden="true" />;
    case 'process-automation':
      return <Workflow className={cls} aria-hidden="true" />;
    case 'data-analytics':
      return <Database className={cls} aria-hidden="true" />;
    default:
      return <ServerCog className={cls} aria-hidden="true" />;
  }
}

export function ServicesSection({
  activeServiceId,
  onSelectActiveService,
  onInquireService,
}: ServicesSectionProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [modalService, setModalService] = useState<ServiceItem | null>(null);
  const activeService = SERVICES.find((s) => s.id === activeServiceId) ?? SERVICES[0];

  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const rows = list.querySelectorAll('[data-service-row]');
      gsap.fromTo(
        rows,
        { y: 14 },
        {
          y: 0,
          duration: 0.44,
          stagger: 0.028,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: list,
            start: 'top 99%',
            end: 'bottom 2%',
            toggleActions: 'play none play none',
          },
        },
      );
    }, listRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="services"
      data-nav-theme="dark"
      className="scroll-mt-12 py-20 sm:py-28 lg:py-36 bg-[#050505] text-white border-t border-white/10"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 lg:mb-20 items-end">
          <div className="lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#00C2A8] mb-4">
              / Services · Capabilities
            </div>
            <SplitText
              as="h2"
              text="Defining the direction"
              accentSuffix="."
              mode="words"
              className="font-display font-semibold tracking-[-0.04em] text-white leading-[0.98]"
              style={{ fontSize: 'clamp(2.5rem, 5.4vw, 4.75rem)' }}
            />
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-white/65 leading-relaxed max-w-md lg:ml-auto">
              Ten integrated advisory, design, and engineering disciplines built to turn strategic
              ambiguity into resilient production platforms.
            </p>
          </div>
        </div>

        {/* Sticky Visual Spotlight + Interactive Editorial Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div
              data-cursor-label="Explore Service"
              className="bg-[#0E0E10] border border-white/12 rounded-2xl overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-900 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id}
                    initial={{ clipPath: 'inset(10% 0% 10% 0%)', scale: 1.08, opacity: 0.7 }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1, opacity: 1 }}
                    exit={{ opacity: 0.5, scale: 1.04 }}
                    transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    <ResilientImage
                      src={activeService.image}
                      alt={activeService.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.07em] text-white/55 tabular-nums">
                    {activeService.index} · {activeService.engagementModel}
                  </span>
                  <ServiceIcon id={activeService.id} />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                      {activeService.title}
                    </h3>

                    <p className="text-sm text-white/70 leading-relaxed">
                      {activeService.description}
                    </p>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[11px] uppercase tracking-[0.07em] text-white/45 mb-2">
                        Core Deliverables
                      </p>
                      <p className="text-xs sm:text-sm text-white/80">
                        {activeService.deliverables.join(' · ')}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="pt-3 flex flex-wrap items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setModalService(activeService)}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#00C2A8] pb-0.5 border-b border-[#00C2A8] hover:text-white hover:border-white transition-colors cursor-pointer"
                  >
                    <KineticText>EXPLORE SERVICE</KineticText>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onInquireService(activeService.title)}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80 pb-0.5 border-b border-white/30 hover:text-[#00C2A8] hover:border-[#00C2A8] transition-colors cursor-pointer"
                  >
                    <KineticText>START PROJECT</KineticText>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Numbered Service Rows */}
          <div ref={listRef} className="lg:col-span-7 border-t border-white/12">
            {SERVICES.map((service) => {
              const isActive = service.id === activeService.id;
              return (
                <div
                  key={service.id}
                  data-service-row
                  onMouseEnter={() => onSelectActiveService(service.id)}
                  className={`group border-b border-white/12 py-6 sm:py-7 transition-all duration-200 ${
                    isActive ? 'bg-white/[0.04] px-5 -mx-5 rounded-xl' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => onSelectActiveService(service.id)}
                      className="text-left flex-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00C2A8]"
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`font-mono text-xs tabular-nums transition-colors ${
                            isActive ? 'text-[#00C2A8] font-medium' : 'text-white/45'
                          }`}
                        >
                          {service.index}
                        </span>
                        <h3
                          className={`font-display text-xl sm:text-2xl font-semibold tracking-tight transition-transform duration-200 ${
                            isActive
                              ? 'text-[#00C2A8] translate-x-1.5'
                              : 'text-white group-hover:translate-x-1.5 group-hover:text-[#00C2A8]'
                          }`}
                        >
                          {service.title}
                        </h3>
                      </div>
                      <p className="mt-2 pl-8 text-sm text-white/60 leading-relaxed max-w-xl">
                        {service.shortTagline}
                      </p>
                    </button>

                    <div className="pl-8 sm:pl-0 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectActiveService(service.id);
                          setModalService(service);
                        }}
                        aria-label={`Explore ${service.title}`}
                        className="group/btn inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/75 hover:text-[#00C2A8] pb-0.5 border-b border-white/25 hover:border-[#00C2A8] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <KineticText>EXPLORE</KineticText>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {modalService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setModalService(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0E0E10] text-white border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="aspect-[16/9] overflow-hidden bg-neutral-900 relative">
                <ResilientImage
                  src={modalService.image}
                  alt={modalService.imageAlt}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setModalService(null)}
                  aria-label="Close service details"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-[#00C2A8] hover:text-[#050505] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.07em] text-[#00C2A8] tabular-nums">
                    {modalService.index} · {modalService.engagementModel}
                  </span>
                  <ServiceIcon id={modalService.id} />
                </div>

                <div>
                  <h3
                    id="service-modal-title"
                    className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                  >
                    {modalService.title}
                  </h3>
                  <p className="mt-3 text-base text-white/75 leading-relaxed">
                    {modalService.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-[11px] uppercase tracking-[0.08em] text-white/50 mb-3">
                    Typical Deliverables
                  </h4>
                  <ul className="space-y-2">
                    {modalService.deliverables.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-white/80 flex items-center justify-between py-2 border-b border-white/8 last:border-b-0"
                      >
                        <span>{item}</span>
                        <span className="font-mono text-xs text-[#00C2A8]">Included</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setModalService(null)}
                    className="text-xs font-medium uppercase tracking-[0.08em] text-white/70 hover:text-white border-b border-white/25 pb-0.5 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const title = modalService.title;
                      setModalService(null);
                      onInquireService(title);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00C2A8] text-[#050505] text-xs font-semibold uppercase tracking-[0.07em] hover:bg-white transition-colors cursor-pointer"
                  >
                    <span>Discuss This Service</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
