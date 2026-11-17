import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FEATURED_PROJECTS, type ProjectConcept } from '../data/siteContent';
import { gsap } from '../utils/gsapSetup';
import { computeReelProgress, filterProjectsByIndustry } from '../utils/motionConfig';
import { ResilientImage } from './ResilientImage';
import { ImageMaskReveal } from './motion/ImageMaskReveal';
import { KineticText } from './motion/KineticLink';
import { SplitText } from './motion/SplitText';

interface ProjectsSectionProps {
  onStartProjectInquiry: (projectTitle: string) => void;
}

const INDUSTRIES = [
  'All',
  'Financial Technology',
  'Cybersecurity & Energy',
  'Architecture & Luxury Retail',
  'Enterprise Advisory',
];

export function ProjectsSection({ onStartProjectInquiry }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startScrollLeft: number;
  }>({ active: false, moved: false, startX: 0, startScrollLeft: 0 });
  const suppressClickRef = useRef(false);

  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid');
  const [selectedProject, setSelectedProject] = useState<ProjectConcept | null>(null);
  const [reelProgress, setReelProgress] = useState(0);
  const [activeReelIdx, setActiveReelIdx] = useState(0);

  const visibleProjects = filterProjectsByIndustry(FEATURED_PROJECTS, selectedIndustry);

  useEffect(() => {
    const grid = gridRef.current;
    if (
      viewMode !== 'grid' ||
      !grid ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const metas = grid.querySelectorAll('[data-project-meta]');
      if (!metas.length) return;
      gsap.fromTo(
        metas,
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
  }, [selectedIndustry, viewMode]);

  useEffect(() => {
    if (viewMode !== 'gallery') return;
    const node = reelRef.current;
    if (!node) return;

    const updateProgress = () => {
      const progress = computeReelProgress(node.scrollLeft, node.scrollWidth, node.clientWidth);
      setReelProgress(progress);
      if (visibleProjects.length > 0) {
        const approxIdx = Math.min(
          visibleProjects.length - 1,
          Math.max(0, Math.round(progress * (visibleProjects.length - 1))),
        );
        setActiveReelIdx(approxIdx);
      }
    };

    updateProgress();
    node.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      node.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [viewMode, visibleProjects.length]);

  const scrollReel = (direction: 'prev' | 'next') => {
    const node = reelRef.current;
    if (!node) return;
    const distance = Math.max(node.clientWidth * 0.65, 360);
    node.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  const handleReelPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const node = reelRef.current;
    if (!node || e.button !== 0) return;
    dragStateRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startScrollLeft: node.scrollLeft,
    };
  };

  const handleReelPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const node = reelRef.current;
    const state = dragStateRef.current;
    if (!node || !state.active) return;
    const delta = e.clientX - state.startX;
    if (Math.abs(delta) > 6) {
      state.moved = true;
    }
    if (state.moved) {
      node.scrollLeft = state.startScrollLeft - delta * 1.15;
    }
  };

  const handleReelPointerEnd = () => {
    if (dragStateRef.current.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 80);
    }
    dragStateRef.current.active = false;
    dragStateRef.current.moved = false;
  };

  const openProjectModal = (project: ProjectConcept) => {
    if (suppressClickRef.current) return;
    setSelectedProject(project);
  };

  return (
    <section
      id="projects"
      data-nav-theme="dark"
      ref={sectionRef}
      className="scroll-mt-12 py-20 sm:py-28 lg:py-36 bg-[#050505] text-white border-t border-white/10"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 lg:mb-16 items-end">
          <div className="lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#00C2A8] mb-4">
              / Projects · Concept Portfolio
            </div>
            <SplitText
              as="h2"
              text="Ideas with impact"
              accentSuffix="."
              mode="words"
              className="font-display font-semibold tracking-[-0.04em] text-white leading-[0.98]"
              style={{ fontSize: 'clamp(2.5rem, 5.4vw, 4.75rem)' }}
            />
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-white/65 leading-relaxed max-w-md lg:ml-auto">
              Selected architectural and digital product showcases demonstrating how we unite
              brand precision with production software engineering.
            </p>
          </div>
        </div>

        {/* Minimal NK-Style Uppercase Filter Strip + Editorial Grid / Reel Switch */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/12 mb-12">
          <div
            role="tablist"
            aria-label="Filter concept projects by industry"
            className="flex flex-wrap items-center gap-5 sm:gap-7"
          >
            {INDUSTRIES.map((industry) => {
              const active = industry === selectedIndustry;
              return (
                <button
                  key={industry}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`relative pb-1 text-[11px] font-medium uppercase tracking-[0.07em] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active ? 'text-[#00C2A8]' : 'text-white/55 hover:text-white'
                  }`}
                >
                  <span>{industry}</span>
                  {active && (
                    <motion.span
                      layoutId="projects-industry-bar"
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-0 inset-x-0 h-[1px] bg-[#00C2A8]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 border-l border-white/12 pl-4">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`pb-1 text-[11px] font-medium uppercase tracking-[0.07em] border-b transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'text-white border-[#00C2A8]'
                  : 'text-white/45 border-transparent hover:text-white'
              }`}
            >
              Editorial Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('gallery')}
              aria-pressed={viewMode === 'gallery'}
              className={`pb-1 text-[11px] font-medium uppercase tracking-[0.07em] border-b transition-colors cursor-pointer ${
                viewMode === 'gallery'
                  ? 'text-white border-[#00C2A8]'
                  : 'text-white/45 border-transparent hover:text-white'
              }`}
            >
              Horizontal Reel
            </button>
          </div>
        </div>

        {viewMode === 'gallery' ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#00C2A8] tabular-nums">
                  {String(activeReelIdx + 1).padStart(2, '0')} /{' '}
                  {String(visibleProjects.length).padStart(2, '0')}
                </span>
                <span className="text-xs text-white/55">
                  Drag horizontally or use controls to inspect showcases
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollReel('prev')}
                  aria-label="Scroll project reel left"
                  className="w-10 h-10 rounded-full border border-white/25 text-white flex items-center justify-center hover:bg-[#00C2A8] hover:text-[#050505] hover:border-[#00C2A8] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollReel('next')}
                  aria-label="Scroll project reel right"
                  className="w-10 h-10 rounded-full border border-white/25 text-white flex items-center justify-center hover:bg-[#00C2A8] hover:text-[#050505] hover:border-[#00C2A8] transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="h-[1px] w-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-[#00C2A8] origin-left transition-transform duration-150 ease-out"
                style={{ transform: `scaleX(${Math.max(0.08, reelProgress)})` }}
              />
            </div>

            <div
              ref={reelRef}
              data-cursor-label="Drag Reel"
              onPointerDown={handleReelPointerDown}
              onPointerMove={handleReelPointerMove}
              onPointerUp={handleReelPointerEnd}
              onPointerCancel={handleReelPointerEnd}
              onPointerLeave={handleReelPointerEnd}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
            >
              {visibleProjects.map((project) => (
                <article
                  key={project.id}
                  className="min-w-[85vw] sm:min-w-[540px] lg:min-w-[680px] snap-start flex flex-col shrink-0 group"
                >
                  <button
                    type="button"
                    data-cursor-label="Explore Project"
                    onClick={() => openProjectModal(project)}
                    aria-label={`Inspect ${project.title} concept case study`}
                    className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-900 text-left cursor-pointer"
                  >
                    <ResilientImage
                      src={project.image}
                      alt={project.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </button>

                  <div className="pt-4 space-y-1.5">
                    <div className="font-mono text-[11px] uppercase tracking-[0.07em] text-white/55">
                      / {project.statusLabel}
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-white group-hover:text-[#00C2A8] transition-colors">
                        {project.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => openProjectModal(project)}
                        className="text-[11px] uppercase tracking-[0.07em] text-white/75 hover:text-[#00C2A8] border-b border-white/30 pb-0.5 cursor-pointer shrink-0"
                      >
                        Details
                      </button>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">{project.solution}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            ref={gridRef}
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14 lg:gap-x-10 lg:gap-y-16"
          >
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project) => (
                <motion.article
                  layout
                  key={project.id}
                  initial={{ clipPath: 'inset(8% 0% 0% 0%)', y: 18 }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
                  exit={{ clipPath: 'inset(0% 0% 100% 0%)', y: -10 }}
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col"
                >
                  <button
                    type="button"
                    data-cursor-label="Explore Project"
                    onClick={() => openProjectModal(project)}
                    aria-label={`Inspect ${project.title} concept case study`}
                    className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-neutral-900 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C2A8]"
                  >
                    <ImageMaskReveal direction="center" parallax className="w-full h-full">
                      <ResilientImage
                        src={project.image}
                        alt={project.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </ImageMaskReveal>
                  </button>

                  <div
                    data-project-meta
                    className="pt-5 flex flex-col gap-2 will-change-transform"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/50">
                        / {project.statusLabel}
                      </span>
                      <span className="font-mono text-[11px] text-white/40 tabular-nums">
                        {project.index}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white group-hover:text-[#00C2A8] transition-colors">
                        <button
                          type="button"
                          onClick={() => openProjectModal(project)}
                          className="text-left cursor-pointer"
                        >
                          {project.title}
                        </button>
                      </h3>
                      <button
                        type="button"
                        onClick={() => openProjectModal(project)}
                        className="group/btn inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.07em] text-white/75 hover:text-[#00C2A8] pb-0.5 border-b border-white/25 hover:border-[#00C2A8] transition-colors cursor-pointer shrink-0"
                      >
                        <KineticText>EXPLORE</KineticText>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <p className="text-sm text-white/65 leading-relaxed max-w-lg">
                      {project.solution}
                    </p>
                    <p className="text-xs font-mono text-[#00C2A8]/90 pt-1">
                      {project.outcome}
                    </p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0E0E10] text-white border border-white/15 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="aspect-[16/9] overflow-hidden relative bg-neutral-900">
                <ResilientImage
                  src={selectedProject.image}
                  alt={selectedProject.imageAlt}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close concept case study"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-[#00C2A8] hover:text-[#050505] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#00C2A8]">
                  {selectedProject.index} · {selectedProject.industry} · {selectedProject.statusLabel}
                </div>
                <h3
                  id="project-modal-title"
                  className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white"
                >
                  {selectedProject.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.08em] text-white/50 mb-2">
                      The Challenge
                    </h4>
                    <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                      {selectedProject.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.08em] text-white/50 mb-2">
                      Architectural Solution
                    </h4>
                    <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-white/[0.04] border border-white/10 rounded-xl space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.08em] text-white/55">
                    Projected Concept Outcome
                  </div>
                  <p className="text-sm sm:text-base font-medium text-[#00C2A8]">
                    {selectedProject.outcome}
                  </p>
                  <p className="text-xs font-mono text-white/55 pt-1">
                    Stack: {selectedProject.technologies.join(' · ')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="text-xs font-medium uppercase tracking-[0.08em] text-white/70 hover:text-white border-b border-white/25 pb-0.5 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const title = selectedProject.title;
                      setSelectedProject(null);
                      onStartProjectInquiry(title);
                    }}
                    className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00C2A8] text-[#050505] text-xs font-semibold uppercase tracking-[0.07em] hover:bg-white transition-colors cursor-pointer"
                  >
                    <KineticText>Build Something Similar</KineticText>
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
