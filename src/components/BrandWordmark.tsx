interface BrandWordmarkProps {
  className?: string;
  tone?: 'dark' | 'light';
}

export function BrandWordmark({ className = '', tone = 'dark' }: BrandWordmarkProps) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${tone === 'light' ? 'text-white' : 'text-[#0A0A0A]'} ${className}`}>
      <span>F</span>
      <span className="text-[#00A994]">13</span>
      <span>&nbsp;Technologies</span>
    </span>
  );
}
