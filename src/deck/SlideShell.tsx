import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clsx} from 'clsx';
import {Kicker} from './typography';

export type SlideShellProps = {
  slideNo: number;
  title: string;
  kicker?: string;
  speaker?: boolean;
  speakerNotes?: string[];
  children: React.ReactNode;
};

export const SlideShell: React.FC<SlideShellProps> = ({
  slideNo,
  title,
  kicker,
  speaker,
  speakerNotes,
  children,
}) => {
  return (
    <AbsoluteFill
      className={clsx(
        'px-[96px] py-[72px] text-[color:var(--govai-text)]',
        'bg-[color:var(--govai-bg)]',
      )}
      style={{
        background:
          'radial-gradient(1100px 700px at 76% 12%, rgba(134,176,146,0.06), rgba(11,14,19,0) 58%), radial-gradient(900px 520px at 10% 10%, rgba(139,149,163,0.05), rgba(11,14,19,0) 60%), var(--govai-bg)',
      }}
    >
      <div className="absolute left-[96px] right-[96px] top-[40px] flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="text-[13px] font-[720] tracking-[0.02em]">GovAI</div>
          <div className="h-[10px] w-[1px] bg-[color:var(--govai-border-subtle)]" />
          <Kicker className="tracking-[0.14em]">Investor Deck</Kicker>
        </div>
        <div className="font-mono text-[12px] text-[color:var(--govai-text-3)]">
          {String(slideNo).padStart(2, '0')}
        </div>
      </div>

      <div className="mt-[36px]">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <div className="mt-3 text-[18px] text-[color:var(--govai-text-3)]">{title}</div>
      </div>

      <div className="mt-[38px]">{children}</div>

      {speaker ? (
        <div className="absolute bottom-[40px] left-[96px] right-[96px]">
          <div className="rounded-[12px] border border-[color:var(--govai-border-subtle)] bg-[rgba(10,12,16,0.62)] px-4 py-3 backdrop-blur-[10px]">
            <div className="text-[11px] tracking-[0.16em] uppercase text-[color:var(--govai-text-3)]">
              Speaker notes
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] leading-[1.45] text-[color:var(--govai-text-2)]">
              {(speakerNotes ?? []).slice(0, 6).map((n) => (
                <div key={n} className="flex items-start gap-2">
                  <div className="mt-[7px] h-[4px] w-[4px] rounded-full bg-[color:var(--govai-text-3)]" />
                  <div>{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

