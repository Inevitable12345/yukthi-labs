import { Building2, Landmark, ShieldAlert } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { QrPanel } from "@/components/ui/QrPanel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bankDetails, paymentWarning, qrCodes } from "@/content/payment";

const paymentQr = qrCodes.find((qr) => qr.id === "payment")!;

const rows: { label: string; value: string | undefined; copy?: boolean }[] = [
  { label: "Account number", value: bankDetails.accountNumber, copy: true },
  { label: "IFSC code", value: bankDetails.ifsc, copy: true },
  { label: "Bank", value: bankDetails.bank },
  { label: "Branch", value: bankDetails.branch },
  { label: "Account name", value: bankDetails.accountName },
];

export function PaymentSection({ heading = true }: { heading?: boolean }) {
  return (
    <section
      id="payment"
      className="relative bg-surface py-20 lg:py-28"
      aria-labelledby="payment-heading"
    >
      <div className="container-page">
        {heading && (
          <SectionHeading
            eyebrow="Payment Information"
            title="Conference bank details"
            lead="Registration fees may be transferred to the account below. Always confirm the details with the organising committee before paying."
            align="center"
          />
        )}

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-[1.45fr_1fr]">
          {/* Bank card */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="flex items-center gap-3 border-b border-line bg-gradient-to-r from-deep to-royal px-5 py-4 text-white sm:px-6">
                <Landmark className="size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-display text-base font-bold">
                    Account for registration fees
                  </p>
                  <p className="text-xs text-white/70">
                    Verify before transferring any amount
                  </p>
                </div>
              </div>

              <dl className="divide-y divide-line">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"
                  >
                    <dt className="text-sm font-medium text-ink-soft">
                      {row.label}
                    </dt>
                    <dd className="flex items-center gap-2.5">
                      {row.value ? (
                        <>
                          <span className="font-display text-[1.02rem] font-bold tracking-wide text-deep tabular-nums">
                            {row.value}
                          </span>
                          {row.copy && (
                            <CopyButton
                              value={row.value}
                              label={row.label.toLowerCase()}
                            />
                          )}
                        </>
                      ) : (
                        <span className="text-sm italic text-ink-soft">
                          To be confirmed
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex items-start gap-2.5 border-t border-line bg-crimson/5 px-5 py-4 sm:px-6">
                <ShieldAlert className="mt-0.5 size-4.5 shrink-0 text-crimson" aria-hidden="true" />
                <p className="text-[0.85rem] leading-relaxed text-ink">
                  {paymentWarning}
                </p>
              </div>
            </div>

            <p className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
              <Building2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              After payment, please keep your transaction reference. Instructions
              for submitting proof of payment will be published once the official
              process is confirmed.
            </p>
          </Reveal>

          {/* QR */}
          <Reveal delay={0.1}>
            <QrPanel qr={paymentQr} className="h-full justify-center" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
