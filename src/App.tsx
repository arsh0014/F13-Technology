import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { MotionConfig } from 'motion/react';
import { BrandStorySection } from './components/BrandStorySection';
import { CinematicHeroSequence } from './components/CinematicHeroSequence';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FullScreenMenu } from './components/FullScreenMenu';
import { ImpactSection } from './components/ImpactSection';
import { InsightsSection } from './components/InsightsSection';
import { Navbar } from './components/Navbar';
import { ProcessSection } from './components/ProcessSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesSection } from './components/ServicesSection';
import { StudioSection } from './components/StudioSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhyUsSection } from './components/WhyUsSection';
import { CustomCursor } from './components/motion/CustomCursor';
import { IntroLoader } from './components/motion/IntroLoader';
import { PageTransitionCurtain } from './components/motion/PageTransitionCurtain';
import { SERVICES } from './data/siteContent';
import { ScrollTrigger, gsap } from './utils/gsapSetup';
import { shouldShowIntroLoader } from './utils/motionConfig';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Home',
  'digital-hero': 'Digital Reality',
  impact: 'Impact',
  projects: 'Projects',
  services: 'Services',
  programs: 'Programs',
  method: 'Method',
  insights: 'Insights',
  testimonials: 'Voices',
  studio: 'Studio',
  contact: 'Let’s Talk',
};

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const [showLoader, setShowLoader] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return shouldShowIntroLoader(reduced, window.location.search);
  });
  const [introComplete, setIntroComplete] = useState<boolean>(() => !showLoader);
  const [menuOpen, setMenuOpen] = useState(false);

  const [curtainActive, setCurtainActive] = useState(false);
  const [curtainLabel, setCurtainLabel] = useState('');

  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES[0].id);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [preselectedContextNote, setPreselectedContextNote] = useState<string>('');

  // Sync Lenis smooth scroll with GSAP ScrollTrigger
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setShowLoader(false);
    setIntroComplete(true);
    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  const handleScrollToY = useCallback((targetY: number) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lenisRef.current && !reducedMotion) {
      lenisRef.current.scrollTo(targetY, { duration: 1.15 });
    } else {
      window.scrollTo({ top: targetY, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }, []);

  const jumpToSection = useCallback((sectionId: string, useCurtain = false) => {
    const resolvedId = sectionId === 'home' ? 'hero' : sectionId === 'work' ? 'projects' : sectionId;
    const target = resolvedId === 'hero' ? document.body : document.getElementById(resolvedId);
    if (!target) return;

    const performScroll = () => {
      if (resolvedId === 'hero') {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: useCurtain });
        } else {
          window.scrollTo({ top: 0, behavior: useCurtain ? 'auto' : 'smooth' });
        }
        return;
      }

      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { immediate: useCurtain });
      } else {
        target.scrollIntoView({ behavior: useCurtain ? 'auto' : 'smooth', block: 'start' });
      }
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!useCurtain || reducedMotion) {
      performScroll();
      return;
    }

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    setCurtainLabel(SECTION_LABELS[resolvedId] ?? 'Arkon');
    setCurtainActive(true);

    transitionTimerRef.current = window.setTimeout(() => {
      performScroll();
      transitionTimerRef.current = window.setTimeout(() => {
        setCurtainActive(false);
        window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 240);
    }, 340);
  }, []);

  const handleInquireService = useCallback(
    (serviceTitle: string) => {
      setPreselectedService(serviceTitle);
      setPreselectedContextNote(`Interested in learning more about ${serviceTitle}.`);
      jumpToSection('contact', false);
    },
    [jumpToSection],
  );

  const handleStartProjectFromCase = useCallback(
    (projectTitle: string) => {
      setPreselectedService('Software Development');
      setPreselectedContextNote(
        `Exploring a project inspired by the ${projectTitle} concept showcase.`,
      );
      jumpToSection('contact', false);
    },
    [jumpToSection],
  );

  const handleSelectServiceFromFooter = useCallback(
    (serviceId: string) => {
      setActiveServiceId(serviceId);
      jumpToSection('services', true);
    },
    [jumpToSection],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-[#0A0A0A] overflow-x-clip">
        <CustomCursor />

        {showLoader && <IntroLoader onComplete={handleLoaderComplete} />}

        <PageTransitionCurtain isActive={curtainActive} targetLabel={curtainLabel} />

        <Navbar
          introComplete={introComplete}
          onNavigateSection={(id) => jumpToSection(id, true)}
          onOpenMenu={() => setMenuOpen(true)}
          menuOpen={menuOpen}
        />

        <FullScreenMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigateSection={(id) => jumpToSection(id, true)}
        />

        <main>
          <CinematicHeroSequence
            introComplete={introComplete}
            menuOpen={menuOpen}
            onExploreImpact={() => jumpToSection('impact', false)}
            onRequestScrollToY={handleScrollToY}
          />

          <ImpactSection onViewResults={() => jumpToSection('projects', false)} />

          <BrandStorySection introComplete={introComplete} />

          <ProjectsSection onStartProjectInquiry={handleStartProjectFromCase} />

          <ServicesSection
            activeServiceId={activeServiceId}
            onSelectActiveService={setActiveServiceId}
            onInquireService={handleInquireService}
          />

          <ProcessSection />

          <WhyUsSection introComplete={introComplete} />

          <InsightsSection />

          <TestimonialsSection />

          <StudioSection onStartConversation={() => jumpToSection('contact', false)} />

          <ContactSection
            preselectedService={preselectedService}
            preselectedContextNote={preselectedContextNote}
          />
        </main>

        <Footer
          onNavigateSection={(id) => jumpToSection(id, true)}
          onSelectServiceFromFooter={handleSelectServiceFromFooter}
        />
      </div>
    </MotionConfig>
  );
}
