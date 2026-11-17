import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  INSIGHTS_ARTICLES,
  INSIGHT_CATEGORIES,
  type InsightArticle,
  type InsightCategory,
} from '../data/siteContent';
import { filterInsightsByCategory } from '../utils/catalog';
import { gsap } from '../utils/gsapSetup';
import { ResilientImage } from './ResilientImage';
import { ImageMaskReveal } from './motion/ImageMaskReveal';
import { KineticText } from './motion/KineticLink';
import { SplitText } from './motion/SplitText';

export function InsightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('All');
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);

  const visibleArticles = filterInsightsByCategory(INSIGHTS_ARTICLES, selectedCategory);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll('[data-insight-card]');
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { y: 20 },
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
  }, [selectedCategory]);

  return (
    <section
      id="insights"
      data-nav-theme="dark"
      ref={sectionRef}
      className="scroll-mt-12 py-20 sm:py-28 lg:py-36 bg-[#050505] text-white border-t border-white/10"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end">
          <div className="lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#00C2A8] mb-4">
              / Insights · Field Notes
            </div>
            <SplitText
              as="h2"
              text="How we think"
              accentSuffix="."
              mode="words"
              className="font-display font-semibold tracking-[-0.04em] text-white leading-[0.98]"
              style={{ fontSize: 'clamp(2.5rem, 5.4vw, 4.75rem)' }}
            />
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-white/65 leading-relaxed max-w-md lg:ml-auto">
              Perspectives from our principal engineers, security architects, and design
              directors on building durable enterprise systems.
            </p>
          </div>
        </div>

        {/* Minimal NK-Style Uppercase Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter insights by category"
          className="flex flex-wrap items-center gap-5 sm:gap-7 pb-8 border-b border-white/12"
        >
          {INSIGHT_CATEGORIES.map((category) => {
            const isSelected = category === selectedCategory;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(category)}
                className={`relative pb-1 text-[11px] font-medium uppercase tracking-[0.07em] whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00C2A8] ${
                  isSelected ? 'text-[#00C2A8]' : 'text-white/55 hover:text-white'
                }`}
              >
                <span>{category}</span>
                {isSelected && (
                  <motion.span
                    layoutId="insight-category-bar"
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-0 inset-x-0 h-[1px] bg-[#00C2A8]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Multi-column editorial portrait/landscape card strip matching NK Insights frame */}
        <motion.div
          ref={gridRef}
          layout
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleArticles.map((article) => (
              <motion.article
                layout
                key={article.id}
                data-insight-card
                initial={{ clipPath: 'inset(10% 0% 0% 0%)', y: 18 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
                exit={{ clipPath: 'inset(0% 0% 100% 0%)', y: -10 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col justify-between will-change-transform"
              >
                <div>
                  <button
                    type="button"
                    data-cursor-label="Read"
                    onClick={() => setActiveArticle(article)}
                    aria-label={`Read article: ${article.title}`}
                    className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900 mb-4 cursor-pointer block text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C2A8]"
                  >
                    <ImageMaskReveal direction="up" parallax className="w-full h-full">
                      <ResilientImage
                        src={article.image}
                        alt={article.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </ImageMaskReveal>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none"
                    />
                    <div className="absolute bottom-4 left-4 right-4 text-[10px] font-mono uppercase tracking-[0.08em] text-white/80 pointer-events-none">
                      / {article.readTime}
                    </div>
                  </button>

                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#00C2A8] mb-2">
                    {article.category}
                  </div>

                  <h3 className="font-display text-lg font-semibold tracking-tight text-white group-hover:text-[#00C2A8] transition-colors leading-snug">
                    <button
                      type="button"
                      onClick={() => setActiveArticle(article)}
                      className="text-left cursor-pointer"
                    >
                      {article.title}
                    </button>
                  </h3>

                  <p className="mt-2 text-xs text-white/60 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.07em] text-white/80 hover:text-[#00C2A8] transition-colors cursor-pointer"
                  >
                    <KineticText>READ NOTE</KineticText>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveArticle(null)}
          >
            <motion.article
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="article-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0E0E10] text-white border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="aspect-[16/9] overflow-hidden relative bg-neutral-900">
                <ResilientImage
                  src={activeArticle.image}
                  alt={activeArticle.imageAlt}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  aria-label="Close article reader"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-[#00C2A8] hover:text-[#050505] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="p-6 sm:p-10 space-y-5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-white/55">
                  <span className="text-[#00C2A8]">{activeArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArticle.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArticle.readTime}</span>
                </div>

                <h3
                  id="article-modal-title"
                  className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                >
                  {activeArticle.title}
                </h3>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  {activeArticle.body.map((paragraph, i) => (
                    <p key={i} className="text-base text-white/75 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveArticle(null)}
                    className="px-6 py-2.5 rounded-full bg-[#00C2A8] text-[#050505] text-xs font-semibold uppercase tracking-[0.07em] hover:bg-white transition-colors cursor-pointer"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
