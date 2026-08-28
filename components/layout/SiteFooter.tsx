import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { Hairline } from "@/components/ui/Hairline";
import { NAVIGATION, SITE } from "@/lib/metadata/site";

export function SiteFooter() {
  return (
    <footer data-print-hidden="true" className="mt-32 px-5 pb-14 sm:px-8">
      <div className="mx-auto max-w-[86rem]">
        <Hairline />
        <div className="grid gap-10 pt-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="text-bone" />
            <p className="standfirst mt-4 max-w-[34ch] text-[1rem]">{SITE.mission}</p>
            <p className="mt-4 max-w-[46ch] font-mono text-[0.7rem] leading-relaxed tracking-[0.08em] text-ash">
              {SITE.bet} Yukthi is an early-stage research and engineering effort. Nothing on this
              site is a claim of deployed capability, and no forecast published here carries a
              probability.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="label-dim mb-3">Exhibition</p>
            <ul className="space-y-2">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-ash transition-colors hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label-dim mb-3">Standards</p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-ash transition-colors hover:text-bone"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/evidence"
                  className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-ash transition-colors hover:text-bone"
                >
                  Evidence standard
                </Link>
              </li>
            </ul>
            <p className="mt-6 font-mono text-[0.66rem] tracking-[0.12em] text-ash">
              © {new Date().getFullYear()} {SITE.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
