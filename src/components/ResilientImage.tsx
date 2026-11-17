import { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'eager',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full min-h-[180px] bg-gradient-to-br from-[#F4F4F2] via-[#EBEBE7] to-[#E0E0DA] flex flex-col items-center justify-center p-6 text-center text-[#525252]"
      >
        <Layers className="w-7 h-7 mb-2 text-[#00C2A8]/80" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-[#0A0A0A]/80">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
