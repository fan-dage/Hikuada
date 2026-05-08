"use client";

import { useEffect, useState } from "react";

/** Client-only; first render is `false` to match SSR and avoid hydration mismatch. */
export function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const read = () => setMatches(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, [query]);

  return matches;
}
