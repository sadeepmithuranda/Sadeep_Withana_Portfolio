import { useState } from 'react';
import { asset, site } from '../../config/site';
import { profile } from '../../data/profile';

/**
 * Lab-badge style profile card. Shows the photo at `site.photo.path`
 * (public/images/profile.jpg by default). Until that file exists it shows
 * a monogram placeholder instead of a broken image.
 */
export default function ProfileBadge() {
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>(site.photo.path ? 'loading' : 'missing');
  const showPhoto = state === 'ok';

  return (
    <div className="panel reg-marks flex items-center gap-5 p-4 sm:p-5">
      <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-[3px] border border-line2 bg-bg2 sm:w-32">
        {site.photo.path && state !== 'missing' && (
          <img
            src={asset(site.photo.path)}
            alt={site.photo.alt}
            width={256}
            height={256}
            loading="lazy"
            onLoad={() => setState('ok')}
            onError={() => setState('missing')}
            className={`h-full w-full object-cover transition-opacity duration-500 ${showPhoto ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {!showPhoto && (
          <div className="board-grid absolute inset-0 grid place-items-center" aria-hidden={state === 'loading'}>
            <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Photo coming soon">
              {/* traces into the monogram, like a chip footprint */}
              <g stroke="var(--line-2)" strokeWidth="1.2" fill="none">
                <path d="M0 30h18l6 6v8" />
                <path d="M100 70H82l-6-6v-8" />
                <path d="M30 100V84l6-6h6" />
                <path d="M70 0v16l-6 6h-6" />
              </g>
              <rect x="24" y="24" width="52" height="52" rx="3" fill="var(--panel)" stroke="var(--accent)" strokeWidth="1.4" />
              <text
                x="50"
                y="56"
                textAnchor="middle"
                fill="var(--fg)"
                fontFamily="var(--font-display)"
                fontWeight="700"
                fontSize="20"
                letterSpacing="1"
              >
                SW
              </text>
              <circle cx="31" cy="31" r="2" fill="var(--accent)" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-dim">lab member</p>
        <p className="font-display text-xl font-bold leading-tight text-fg" style={{ fontStretch: '112%' }}>
          {profile.name}
        </p>
        <p className="text-sm text-muted">Computer Engineering Undergraduate</p>
        <p className="font-mono text-xs text-accent">
          {profile.universityShort} · {profile.country}
        </p>
        {state === 'missing' && <p className="mt-1 font-mono text-[0.68rem] text-dim">photo coming soon</p>}
      </div>
    </div>
  );
}
