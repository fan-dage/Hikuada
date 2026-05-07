import { heroPillTags, type BannerHeroRow } from "@/lib/banner-hero";

export function HomeBannerHeroOverlay({ hero }: { hero: BannerHeroRow }) {
  const pills = heroPillTags(hero);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-slate-950/45 via-slate-900/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="mx-auto flex h-full max-w-6xl items-center px-6">
          <div className="max-w-3xl space-y-6 pt-2 text-white">
            <p className="inline-block rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white">
              {hero.badge_text}
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] text-white md:text-6xl">{hero.headline}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">{hero.subheading}</p>
            {pills.length > 0 ? (
              <div className="flex flex-wrap gap-3 text-sm">
                {pills.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-white"
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
