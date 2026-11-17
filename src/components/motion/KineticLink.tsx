import type { ReactNode } from 'react';

interface KineticTextProps {
  children: ReactNode;
  className?: string;
}

/**
 * Dual-layer vertical slot roll on group hover for crisp agency-style typography links.
 */
export function KineticText({ children, className = '' }: KineticTextProps) {
  return (
    <span className={`relative inline-flex overflow-hidden align-middle ${className}`}>
      <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 inline-block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
