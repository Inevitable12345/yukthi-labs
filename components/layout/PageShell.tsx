import type { ReactNode } from "react";
import { Hairline } from "@/components/ui/Hairline";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/**
 * The shared frame for every route other than the exhibition itself. Same
 * grid, same coordinate register, same rules — so /thesis reads as another
 * room rather than as a different website (§44).
 */
export function PageShell({
  coordinate,
  title,
  standfirst,
  children,
}: {
  coordinate: string;
  title: string;
  standfirst?: string;
  children: ReactNode;
}) {
  return (
    <div className="px-5 pt-28 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-[86rem]">
        <header className="max-w-[62rem]">
          <InstrumentLabel>{coordinate}</InstrumentLabel>
          <h1 className="display mt-5">{title}</h1>
          {standfirst ? <p className="standfirst mt-6 max-w-[54ch]">{standfirst}</p> : null}
        </header>
        <Hairline className="mt-12" />
        <div className="pt-12">{children}</div>
      </div>
    </div>
  );
}
