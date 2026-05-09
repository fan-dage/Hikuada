"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";

const imgClass = (objectFit: "cover" | "contain") =>
  `h-full w-full select-none [webkit-touch-callout:none] ${
    objectFit === "contain" ? "bg-slate-100 object-contain object-center" : "object-cover"
  }`;

const galleryContainImgClass =
  "max-h-[min(68vh,640px)] w-auto max-w-full object-contain object-center select-none [webkit-touch-callout:none]";

const galleryFrameClass =
  "flex min-h-[260px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-[300px]";

const cardFrameClass =
  "block h-full w-full overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500";

export function ProductImagePreview({
  src,
  alt,
  objectFit = "cover",
  detailHref,
  detailAriaLabel,
  /** Product detail hero: show the full image (no crop); ignores `objectFit` for the inline thumbnail. */
  galleryContain = false,
}: {
  src: string | null;
  alt: string;
  /** cover: fills area (may crop). contain: full image visible inside area. */
  objectFit?: "cover" | "contain";
  /** When set, click navigates to product detail instead of opening a lightbox. */
  detailHref?: string;
  /** Used with `detailHref` for screen readers (e.g. “View product details”). */
  detailAriaLabel?: string;
  galleryContain?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400 ${
          galleryContain ? "min-h-[200px] w-full" : "h-full"
        }`}
      >
        Product Image Placeholder
      </div>
    );
  }

  const imageClassName = galleryContain ? galleryContainImgClass : imgClass(objectFit);
  const frameClassName = galleryContain ? galleryFrameClass : cardFrameClass;

  if (detailHref) {
    return (
      <Link
        href={detailHref}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        className={frameClassName}
        aria-label={detailAriaLabel || "View product details"}
      >
        <Image
          src={src}
          alt={alt}
          width={galleryContain ? 1600 : 600}
          height={galleryContain ? 1200 : 400}
          draggable={false}
          className={imageClassName}
        />
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        className={frameClassName}
        aria-label="查看产品大图"
      >
        <Image
          src={src}
          alt={alt}
          width={galleryContain ? 1600 : 600}
          height={galleryContain ? 1200 : 400}
          draggable={false}
          className={imageClassName}
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
