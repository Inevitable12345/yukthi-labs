"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Maximize2, QrCode as QrIcon } from "lucide-react";
import type { QrCode } from "@/content/payment";
import { Modal } from "./Modal";
import { cn } from "@/lib/utils";

/**
 * Renders an approved QR code, or an honest placeholder when one has not been
 * supplied yet. A text link always accompanies the code so the destination is
 * reachable without a camera (WCAG) — and so a swapped image is easy to spot.
 */
export function QrPanel({
  qr,
  className,
}: {
  qr: QrCode;
  className?: string;
}) {
  const [zoomed, setZoomed] = useState(false);
  const hasImage = Boolean(qr.image);

  return (
    <>
      <div
        className={cn(
          "flex flex-col items-center rounded-2xl border border-line bg-white p-5 text-center",
          className,
        )}
      >
        <p className="font-display text-base font-semibold text-deep">
          {qr.title}
        </p>

        <div className="relative mt-4">
          {hasImage ? (
            <button
              type="button"
              onClick={() => setZoomed(true)}
              className="group relative block overflow-hidden rounded-xl border border-line p-2"
              aria-label={`Enlarge the ${qr.title.toLowerCase()} QR code`}
            >
              <Image
                src={qr.image as string}
                alt={`QR code — ${qr.caption}`}
                width={200}
                height={200}
                className="size-[168px] object-contain sm:size-[188px]"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-deep/85 py-1.5 text-[0.7rem] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Maximize2 className="size-3.5" aria-hidden="true" />
                Enlarge
              </span>
            </button>
          ) : (
            <div
              className="flex size-[168px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-surface px-4 sm:size-[188px]"
              role="img"
              aria-label={`${qr.title} QR code — awaiting the approved image from the organising committee`}
            >
              <QrIcon className="size-8 text-ink-soft/50" aria-hidden="true" />
              <p className="text-[0.7rem] font-medium leading-snug text-ink-soft">
                Awaiting the approved QR image
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 max-w-[24ch] text-sm text-ink-soft">{qr.caption}</p>

        {qr.href ? (
          <a
            href={qr.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-royal underline underline-offset-4 hover:text-violet"
          >
            {qr.hrefLabel ?? "Open link"}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ) : (
          <p className="mt-3 text-xs font-medium text-ink-soft">
            Link to be published once confirmed by the organising committee.
          </p>
        )}
      </div>

      {hasImage && (
        <Modal
          open={zoomed}
          onClose={() => setZoomed(false)}
          title={qr.title}
          subtitle={qr.caption}
        >
          <div className="flex flex-col items-center gap-4">
            <Image
              src={qr.image as string}
              alt={`Enlarged QR code — ${qr.caption}`}
              width={420}
              height={420}
              className="w-full max-w-sm rounded-xl border border-line p-3"
            />
            {qr.href && (
              <a
                href={qr.href}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-center text-sm font-medium text-royal underline underline-offset-4"
              >
                {qr.href}
              </a>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
