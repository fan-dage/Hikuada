import { heroPillTags, type BannerHeroRow } from "@/lib/banner-hero";

export function HomeBannerHeroOverlay({ hero }: { hero: BannerHeroRow }) {
  const pills = heroPillTags(hero);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-slate-950/45 via-slate-900/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="mx-auto flex h-full max-w-6xl items-start px-4 pb-28 pt-12 text-white sm:px-6 sm:pt-14 md:items-center md:px-6 md:pb-10 md:pt-2">
          <div className="max-w-3xl space-y-3 sm:space-y-4 md:space-y-6">
            <p className="block w-full max-w-full rounded-2xl border border-white/40 bg-white/10 px-4 py-2 text-center text-[11px] font-semibold uppercase leading-snug tracking-wide text-white sm:inline-block sm:w-auto sm:max-w-none sm:rounded-full sm:px-4 sm:py-1.5 sm:text-left sm:text-xs">
              {hero.badge_text}
            </p>
            <h1 className="text-balance text-3xl font-extrabold leading-[1.08] text-white sm:text-4xl md:text-6xl md:leading-[1.05]">
              {hero.headline}
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-white/90 md:text-base md:text-lg">
              {hero.subheading}
            </p>
            {pills.length > 0 ? (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-3">
                {pills.map((label) => (
                  <span
                    key={label}
                    className="flex w-full items-center justify-center rounded-2xl border border-white/40 bg-white/10 px-3 py-2 text-center text-xs font-medium leading-snug text-white sm:inline-flex sm:w-auto sm:shrink-0 sm:rounded-full sm:px-4 sm:py-2 sm:text-left sm:text-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
