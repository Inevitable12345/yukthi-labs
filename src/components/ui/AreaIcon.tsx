import {
  Accessibility,
  BookOpen,
  Brain,
  BrainCircuit,
  ClipboardCheck,
  Compass,
  Cpu,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Laptop,
  LayoutGrid,
  Lightbulb,
  LifeBuoy,
  MonitorSmartphone,
  Scale,
  School,
  Sparkles,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Explicit icon map rather than a dynamic lookup — this keeps the bundle to the
 * twenty icons actually used instead of pulling in the whole icon set.
 */
const icons: Record<string, LucideIcon> = {
  Accessibility,
  BookOpen,
  Brain,
  BrainCircuit,
  ClipboardCheck,
  Compass,
  Cpu,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Laptop,
  LayoutGrid,
  Lightbulb,
  LifeBuoy,
  MonitorSmartphone,
  Scale,
  School,
  Sparkles,
  UserCheck,
  Users,
};

export function AreaIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? LayoutGrid;
  return <Icon className={className} aria-hidden="true" />;
}

/** Rotating accent palette so a long grid of cards never looks monotonous. */
export const accentPalette = [
  { text: "text-royal", bg: "bg-royal/10", ring: "group-hover:ring-royal/30" },
  { text: "text-violet", bg: "bg-violet/10", ring: "group-hover:ring-violet/30" },
  { text: "text-magenta", bg: "bg-magenta/10", ring: "group-hover:ring-magenta/30" },
  { text: "text-emerald", bg: "bg-emerald/10", ring: "group-hover:ring-emerald/30" },
  { text: "text-orange", bg: "bg-orange/10", ring: "group-hover:ring-orange/30" },
  { text: "text-cyan", bg: "bg-cyan/10", ring: "group-hover:ring-cyan/30" },
] as const;

export function accentFor(index: number) {
  return accentPalette[index % accentPalette.length];
}
