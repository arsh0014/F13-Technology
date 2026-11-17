import { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';

interface SplitTextProps {
  text: string;
  accentSuffix?: string;
  accentClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  mode?: 'words' | 'chars';
  triggerOnScroll?: boolean;
  ready?: boolean;
  delay?: number;
  stagger?: number;
}

export function SplitText({
  text,
  accentSuffix = '',
  accentClassName = 'text-[#00C2A8]',
  as: Tag = 'h2',
  className = '',
  style,
  mode = 'words',
  triggerOnScroll = true,
  ready = true,
  delay = 0,
  stagger = 0.025,
}: SplitTextProps) {
  const rootRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    const targets = itemRefs.current.filter(Boolean);
    if (!root || targets.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { yPercent: 0, rotationX: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          yPercent: 105,
          rotationX: 12,
          transformPerspective: 900,
          transformOrigin: '50% 100%',
        },
        {
          yPercent: 0,
          rotationX: 0,
          duration: 0.54,
          delay,
          stagger: Math.min(stagger, 0.03),
          ease: 'power3.out',
          ...(triggerOnScroll
            ? {
                scrollTrigger: {
                  trigger: root,
                  start: 'top 99%',
                  end: 'bottom 2%',
                  toggleActions: 'play none play none',
                },
              }
            : {}),
        },
      );
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [ready, triggerOnScroll, delay, stagger, text, accentSuffix]);

  const tokens = mode === 'chars' ? text.split('') : text.split(' ');
  itemRefs.current = [];

  return (
    <Tag
      ref={rootRef as never}
      aria-label={`${text}${accentSuffix}`}
      className={className}
      style={style}
    >
      {tokens.map((token, idx) => {
        const isLast = idx === tokens.length - 1;
        return (
          <span
            key={`${token}-${idx}`}
            aria-hidden="true"
            className="inline-block overflow-hidden align-top [perspective:900px]"
          >
            <span
              ref={(el) => {
                if (el) itemRefs.current.push(el);
              }}
              className="inline-block will-change-transform"
            >
              {token === ' ' ? '\u00A0' : token}
              {isLast && accentSuffix ? (
                <span className={accentClassName}>{accentSuffix}</span>
              ) : null}
              {mode === 'words' && !isLast ? '\u00A0' : ''}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
