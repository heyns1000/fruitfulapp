import React from 'react';

/**
 * PearLoader — the Fruitful™ pear mark as the app-wide loading brand moment.
 * A soft pulse + orbiting ring keeps the global brand icon present during waits.
 */
export default function PearLoader({ label = 'Loading', fullScreen = false, size = 56 }) {
  const ring = size + 20;

  const inner = (
    <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
      <div className="relative flex items-center justify-center" style={{ width: ring, height: ring }}>
        <span
          className="absolute inset-0 rounded-full border-2 border-primary/25 border-t-primary animate-spin"
          style={{ animationDuration: '1.1s' }}
          aria-hidden="true"
        />
        <img
          src="/brand/favicon.png"
          alt=""
          aria-hidden="true"
          className="object-contain animate-pulse"
          style={{ width: size, height: size, animationDuration: '1.6s' }}
        />
      </div>
      {label ? (
        <p className="text-sm font-medium text-muted-foreground tracking-wide">{label}</p>
      ) : null}
      <span className="sr-only">{label || 'Loading'}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">{inner}</div>
    );
  }
  return inner;
}
