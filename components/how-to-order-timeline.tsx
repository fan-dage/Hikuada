"use client";

import { Fragment, useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { Container, Globe, MessageCircle, Package, Video, Wallet } from "lucide-react";
import { useMatchMedia } from "@/lib/use-match-media";

type Step = {
  title: string;
  description: string;
  detailEn: string;
  detailVi: string;
  detailZh: string;
};

const ICON_CLASS = "text-[#1e293b]";

const STEP_ICONS = [MessageCircle, Package, Wallet, Video, Container, Globe] as const;

const cardShadow =
  "shadow-[0_28px_56px_-14px_rgba(239,246,255,0.95),0_12px_28px_-10px_rgba(226,232,240,0.45)]";

function BoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\*\*(.+)\*\*$/);
        if (m) return <strong key={i}>{m[1]}</strong>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function TimelineDetailBody({
  step,
  langLabels,
  stepPanelClose,
  onClose,
}: {
  step: Step;
  langLabels: { zh: string; en: string; vi: string };
  stepPanelClose: string;
  onClose: () => void;
}) {
  return (
    <>
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{step.title}</p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-slate-200/90">
        <div className="md:pr-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">{langLabels.zh}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            <BoldText text={step.detailZh} />
          </p>
        </div>
        <div className="md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800">{langLabels.en}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-800 sm:text-[15px]">
            <BoldText text={step.detailEn} />
          </p>
        </div>
        <div className="md:pl-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">{langLabels.vi}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
            <BoldText text={step.detailVi} />
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-slate-200/80 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
        >
          {stepPanelClose}
        </button>
      </div>
    </>
  );
}

export function HowToOrderTimeline({
  title,
  steps,
  langLabels,
  stepPanelClose,
}: {
  title: string;
  steps: readonly Step[];
  langLabels: { zh: string; en: string; vi: string };
  stepPanelClose: string;
}) {
  const baseId = useId();
  const panelId = `${baseId}-detail-panel`;
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const inlinePanelRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const isNarrow = useMatchMedia("(max-width: 1279px)");

  const selectStep = useCallback((i: number) => {
    setSelected((prev) => (prev === i ? null : i));
  }, []);

  const closePanel = useCallback(() => {
    setSelected(null);
  }, []);

  const activeStep = selected !== null ? steps[selected] : null;

  useLayoutEffect(() => {
    if (selected === null) return;
    const el = isNarrow ? inlinePanelRef.current : detailPanelRef.current;
    if (!el) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: isNarrow ? "nearest" : "start",
      inline: "nearest",
    });
  }, [selected, isNarrow]);

  return (
    <section
      className="relative overflow-x-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-slate-50/30 py-12 sm:py-16"
      aria-labelledby="how-to-order-timeline-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2
          id="how-to-order-timeline-heading"
          className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>

        <div className="relative mt-12 sm:mt-14">
          <div
            className="pointer-events-none absolute bottom-8 left-1/2 top-8 w-px -translate-x-1/2 bg-slate-200 xl:hidden"
            aria-hidden
          />

          <div
            className="pointer-events-none absolute left-8 right-8 top-[2.85rem] z-0 hidden h-px bg-slate-200 xl:block"
            aria-hidden
          />

          <ol className="relative z-10 m-0 grid list-none grid-cols-1 items-stretch gap-4 p-0 sm:gap-5 xl:grid-cols-6 xl:gap-3">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? MessageCircle;
              const num = String(i + 1).padStart(2, "0");
              const active = selected === i;

              return (
                <Fragment key={`${i}-${step.title}`}>
                  <li className="relative flex min-h-0 min-w-0 xl:h-full">
                    <button
                      type="button"
                      aria-expanded={active}
                      aria-controls={panelId}
                      onClick={() => selectStep(i)}
                      className={cn(
                        "relative flex h-full min-h-0 w-full flex-col items-center overflow-visible rounded-3xl bg-white px-4 pb-5 pt-7 text-center outline-none transition-all duration-200 sm:px-5 sm:pb-6 sm:pt-8 xl:min-h-0",
                        cardShadow,
                        "hover:-translate-y-2 hover:shadow-[0_36px_64px_-12px_rgba(239,246,255,1),0_16px_32px_-8px_rgba(203,213,225,0.5)]",
                        "focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2",
                        active &&
                          "ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-50 shadow-[0_28px_56px_-14px_rgba(255,247,237,0.95),0_12px_28px_-10px_rgba(254,215,170,0.55)]",
                      )}
                    >
                      <span className="sr-only">
                        Step {i + 1} of {steps.length}. {step.title}.
                      </span>

                      <span
                        className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 select-none font-mono text-[4.5rem] font-bold leading-none tracking-tighter text-slate-100/50 sm:text-[5.25rem]"
                        aria-hidden
                      >
                        {num}
                      </span>

                      <Icon
                        strokeWidth={1.25}
                        className={cn("relative z-10 mx-auto h-8 w-8 sm:h-9 sm:w-9", ICON_CLASS)}
                        aria-hidden
                      />

                      <h3 className="relative z-10 mt-4 text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="relative z-10 mt-2 max-w-[14rem] text-[13px] leading-snug text-slate-600 sm:max-w-none sm:text-sm sm:leading-snug">
                        <BoldText text={step.description} />
                      </p>

                      {active ? (
                        <span
                          className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 h-0 w-0 -translate-x-1/2 border-x-[10px] border-x-transparent border-t-[12px] border-t-orange-500"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  </li>

                  {isNarrow && active && activeStep ? (
                    <li className="col-span-full min-w-0">
                      <div
                        ref={inlinePanelRef}
                        id={panelId}
                        role="region"
                        aria-label={activeStep.title}
                        tabIndex={-1}
                        className="scroll-mt-4 rounded-2xl border border-slate-200/90 bg-slate-50 px-4 pb-2 pt-6 shadow-[0_8px_28px_-10px_rgba(15,23,42,0.08)] sm:px-5 sm:pt-7"
                      >
                        <div key={selected} className="howto-order-panel-fade-in">
                          <TimelineDetailBody
                            step={activeStep}
                            langLabels={langLabels}
                            stepPanelClose={stepPanelClose}
                            onClose={closePanel}
                          />
                        </div>
                      </div>
                    </li>
                  ) : null}
                </Fragment>
              );
            })}
          </ol>
        </div>
      </div>

      {!isNarrow && selected !== null && activeStep ? (
        <div
          ref={detailPanelRef}
          id={panelId}
          role="region"
          aria-label={activeStep.title}
          tabIndex={-1}
          className="relative left-1/2 z-20 mt-3 w-screen max-w-[100vw] -translate-x-1/2 scroll-mt-4 border-t border-slate-200/90 bg-slate-50 shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] sm:scroll-mt-6"
        >
          <div key={selected} className="howto-order-panel-fade-in mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10">
            <TimelineDetailBody
              step={activeStep}
              langLabels={langLabels}
              stepPanelClose={stepPanelClose}
              onClose={closePanel}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
