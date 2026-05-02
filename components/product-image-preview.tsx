"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";

export function ProductImagePreview({
  src,
  alt,
  objectFit = "cover",
}: {
  src: string | null;
  alt: string;
  /** cover: fills area (may crop). contain: full image visible inside area. */
  objectFit?: "cover" | "contain";
}) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
        Product Image Placeholder
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        className="block h-full w-full overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        aria-label="查看产品大图"
      >
        <Image
          src={src}
          alt={alt}
          width={600}
          height={400}
          draggable={false}
          className={`h-full w-full select-none [webkit-touch-callout:none] ${
            objectFit === "contain"
              ? "bg-slate-100 object-contain object-center"
              : "object-cover"
          }`}
        />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4"
              onClick={() => setOpen(false)}
              onContextMenu={(event) => event.preventDefault()}
            >
              <div className="relative w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-slate-700 hover:bg-white"
                  aria-label="Close preview"
                >
                  ×
                </button>
                <Image
                  src={src}
                  alt={alt}
                  width={1600}
                  height={1000}
                  draggable={false}
                  className="max-h-[85vh] w-full rounded-lg object-contain select-none [webkit-touch-callout:none]"
                  onContextMenu={(event) => event.preventDefault()}
                  onDragStart={(event) => event.preventDefault()}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
