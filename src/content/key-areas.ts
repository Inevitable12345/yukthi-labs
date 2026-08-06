/**
 * Key research areas invited for ICRTET-2026.
 *
 * The 20 areas below are taken verbatim from the official conference poster.
 * `description` is deliberately left undefined: the UI only expands a card when
 * an approved description exists, so no explanatory text is invented here.
 * `keywords` exist purely to widen the on-page search and are never displayed.
 */

export type KeyArea = {
  id: number;
  title: string;
  /** Name of a lucide-react icon; resolved by `components/ui/AreaIcon`. */
  icon: string;
  keywords: string[];
  description?: string;
};

export const keyAreas: KeyArea[] = [
  {
    id: 1,
    title: "Artificial Intelligence in Education",
    icon: "BrainCircuit",
    keywords: ["ai", "machine learning", "automation", "intelligent tutoring"],
  },
  {
    id: 2,
    title: "Curriculum Development and Innovation",
    icon: "BookOpen",
    keywords: ["syllabus", "course design", "curriculum"],
  },
  {
    id: 3,
    title: "Digital Assessment and Evaluation",
    icon: "ClipboardCheck",
    keywords: ["exam", "testing", "online assessment", "evaluation"],
  },
  {
    id: 4,
    title: "Digital Pedagogy and Teacher Education",
    icon: "MonitorSmartphone",
    keywords: ["pedagogy", "teaching methods", "teacher training"],
  },
  {
    id: 5,
    title: "Educational Psychology in the Digital Era",
    icon: "Brain",
    keywords: ["psychology", "cognition", "motivation", "learning behaviour"],
  },
  {
    id: 6,
    title: "Educational Research and Innovation",
    icon: "FlaskConical",
    keywords: ["research methods", "innovation", "studies"],
  },
  {
    id: 7,
    title: "E-Learning and Virtual Education",
    icon: "Laptop",
    keywords: ["online learning", "mooc", "lms", "distance education", "virtual"],
  },
  {
    id: 8,
    title: "Emerging Technologies in Education",
    icon: "Cpu",
    keywords: ["ar", "vr", "blockchain", "metaverse", "emerging tech"],
  },
  {
    id: 9,
    title: "Ethics and Challenges in Educational Technology",
    icon: "Scale",
    keywords: ["ethics", "privacy", "policy", "challenges", "data protection"],
  },
  {
    id: 10,
    title: "Guidance and Counselling in Education",
    icon: "LifeBuoy",
    keywords: ["counselling", "guidance", "mentoring", "career"],
  },
  {
    id: 11,
    title: "Health, Well-Being and Education",
    icon: "HeartPulse",
    keywords: ["wellbeing", "mental health", "wellness", "health"],
  },
  {
    id: 12,
    title: "Inclusive Education and Assistive Technologies",
    icon: "Accessibility",
    keywords: ["inclusion", "accessibility", "special education", "assistive"],
  },
  {
    id: 13,
    title: "Innovations in Teaching and Learning",
    icon: "Lightbulb",
    keywords: ["teaching", "learning", "innovation", "classroom practice"],
  },
  {
    id: 14,
    title: "Leadership in Educational Technology",
    icon: "Compass",
    keywords: ["leadership", "management", "administration", "governance"],
  },
  {
    id: 15,
    title: "Learner-Centred Approaches in Digital Education",
    icon: "UserCheck",
    keywords: ["learner centred", "personalised learning", "student centred"],
  },
  {
    id: 16,
    title: "Smart Classrooms and Future Learning",
    icon: "School",
    keywords: ["smart classroom", "future learning", "iot", "smart campus"],
  },
  {
    id: 17,
    title: "Student Engagement and Interactive Learning",
    icon: "Users",
    keywords: ["engagement", "interaction", "gamification", "participation"],
  },
  {
    id: 18,
    title: "Teacher Professional Development",
    icon: "GraduationCap",
    keywords: ["professional development", "cpd", "in-service training"],
  },
  {
    id: 19,
    title: "21st-Century Skills and Digital Literacy",
    icon: "Sparkles",
    keywords: [
      "digital literacy",
      "21st century skills",
      "critical thinking",
      "competencies",
    ],
  },
  {
    id: 20,
    title: "Other Related Themes",
    icon: "LayoutGrid",
    keywords: ["other", "related", "miscellaneous", "general"],
  },
];

/** Number of areas shown before the visitor asks to see the rest. */
export const initialVisibleAreas = 8;
