import React from 'react';
import {clsx} from 'clsx';

export const Kicker: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div
    className={clsx(
      'text-[14px] tracking-[0.18em] uppercase text-[color:var(--govai-text-3)]',
      className,
    )}
  >
    {children}
  </div>
);

export const Title: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div
    className={clsx(
      'mt-3 text-[58px] leading-[1.03] font-[780] tracking-[-0.02em] text-[color:var(--govai-text)]',
      className,
    )}
  >
    {children}
  </div>
);

export const Headline: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div
    className={clsx(
      'text-[32px] leading-[1.18] font-[720] tracking-[-0.01em] text-[color:var(--govai-text)]',
      className,
    )}
  >
    {children}
  </div>
);

export const Subhead: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div className={clsx('mt-4 text-[18px] leading-[1.55] text-[color:var(--govai-text-2)]', className)}>
    {children}
  </div>
);

export const BulletList: React.FC<{items: string[]; className?: string}> = ({items, className}) => (
  <div className={clsx('mt-8 flex flex-col gap-4', className)}>
    {items.map((t) => (
      <div key={t} className="flex items-start gap-3">
        <div className="mt-[10px] h-[6px] w-[6px] rounded-full border border-[color:var(--govai-border)] bg-[rgba(185,194,204,0.16)]" />
        <div className="text-[18px] leading-[1.55] text-[color:var(--govai-text-2)]">{t}</div>
      </div>
    ))}
  </div>
);

export const Mono: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <span className={clsx('font-mono text-[color:var(--govai-text-2)]', className)}>{children}</span>
);

