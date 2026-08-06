import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { conference } from "@/content/conference";

const suggestions = [
  { label: "Registration & Call for Papers", href: "/registration" },
  { label: "Key Areas", href: "/registration#key-areas" },
  { label: "Important Dates", href: "/registration#important-dates" },
  { label: "About ICRTET-2026", href: "/about" },
  { label: "Speakers", href: "/speakers" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-deep py-24 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 size-[30rem] rounded-full bg-royal/40 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 size-[26rem] rounded-full bg-violet/30 blur-[110px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.15] mix-blend-overlay" />
      </div>

      <div className="container-page relative text-center">
        <p className="font-display text-[5rem] font-extrabold leading-none text-gradient-light sm:text-[7rem]">
          404
        </p>
        <h1 className="mt-3 text-2xl text-white sm:text-3xl">
          This page could not be found
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-white/70">
          The page you asked for may have moved. Everything about{" "}
          {conference.acronym} is reachable from the links below.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="accent" size="lg" withArrow>
            Back to homepage
          </Button>
          <Button href="/contact" variant="onDark" size="lg">
            Contact the organisers
          </Button>
        </div>

        <nav aria-label="Popular pages" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-2.5">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/45 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
