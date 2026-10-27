export interface ExampleSummary { role: string; text: string }

export const EXAMPLE_SUMMARIES: ExampleSummary[] = [
  {
    role: "Fresher / Student",
    text: "Computer science graduate with a strong foundation in data structures, web development and problem solving. Completed three industry-style projects and a six-month internship where I shipped features used by real customers. Looking for an entry-level software engineering role where I can learn quickly and contribute from day one.",
  },
  {
    role: "Software Developer",
    text: "Software developer with 4+ years of experience building reliable backend services and APIs. Comfortable across the stack with a focus on clean code, testing, and measurable performance improvements. Delivered systems handling 2M+ requests per day.",
  },
  {
    role: "Data Analyst",
    text: "Detail-oriented data analyst with 3 years of experience turning messy datasets into clear decisions. Proficient in SQL, Python and dashboard design, with a track record of automating reports that saved the team 15 hours a week.",
  },
  {
    role: "UI/UX Designer",
    text: "Product designer who blends research, interaction design and front-end awareness to create interfaces people understand on the first try. Led end-to-end redesigns for two B2B products, improving activation by 24%.",
  },
  {
    role: "Marketing Professional",
    text: "Growth marketer with 5 years of experience across content, SEO and paid acquisition. Built campaigns that grew organic traffic 3× and reduced cost per qualified lead by 31%. Comfortable owning both strategy and execution.",
  },
  {
    role: "Experienced Professional",
    text: "Operations leader with 12 years of experience scaling cross-functional teams in fast-moving environments. Known for designing repeatable processes, improving margins, and developing people who go on to lead their own teams.",
  },
  {
    role: "Career Changer",
    text: "Former finance professional transitioning into product management, bringing strong analytical skills and deep domain knowledge. Led a cross-functional pilot that digitised a manual reporting workflow, cutting turnaround from five days to one.",
  },
];

export const ACTION_VERBS = [
  "Achieved", "Analysed", "Automated", "Built", "Collaborated", "Created", "Delivered",
  "Designed", "Developed", "Drove", "Established", "Evaluated", "Generated", "Implemented",
  "Improved", "Increased", "Launched", "Led", "Managed", "Mentored", "Optimised", "Owned",
  "Reduced", "Resolved", "Scaled", "Shipped", "Streamlined", "Tested", "Trained",
];

export interface BulletExample { label: string; text: string }

export const BULLET_EXAMPLES: BulletExample[] = [
  { label: "Impact with numbers", text: "Redesigned the checkout flow, reducing cart abandonment from 68% to 41% in three months." },
  { label: "Scale", text: "Built a caching layer that cut API response time by 55% across 2M daily requests." },
  { label: "Ownership", text: "Owned the migration of 14 legacy reports to a single automated dashboard used by 200+ staff." },
  { label: "Collaboration", text: "Partnered with design and support to prioritise 30+ accessibility fixes in one release cycle." },
  { label: "Without numbers", text: "Introduced a peer code-review checklist that became the default workflow for the whole team." },
  { label: "Fresher project", text: "Developed a hostel complaint tracker used by 300 students, with role-based access and status notifications." },
];

export const WRITING_TIPS: string[] = [
  "Start bullets with a strong action verb, then add what you did and the result.",
  "Add one measurable outcome where you honestly can — time saved, revenue, users, error rate.",
  "Keep each bullet to one or two lines; split anything longer than ~30 words.",
  "Mirror the exact keywords used in the job description when they genuinely describe your work.",
  "Cut “responsible for” — describe what you actually delivered instead.",
  "Use past tense for previous roles and present tense for your current role.",
];

/** Tiny local spelling guide: common resume typos with suggestions. */
const COMMON_TYPOS: Record<string, string> = {
  acheive: "achieve", acheivement: "achievement", accomodate: "accommodate",
  adress: "address", begining: "beginning", calender: "calendar",
  comming: "coming", commited: "committed", developement: "development",
  enviroment: "environment", experince: "experience", freind: "friend",
  independant: "independent", liason: "liaison", maintainance: "maintenance",
  managment: "management", occurence: "occurrence", oppurtunity: "opportunity",
  organisationa: "organisational", profesionnal: "professional",
  recomendation: "recommendation", responsability: "responsibility",
  seperate: "separate", succesful: "successful", teh: "the", tommorow: "tomorrow",
};

export function localSpellingHints(text: string): { word: string; suggestion: string }[] {
  const words = text.toLowerCase().match(/[a-z']+/g) ?? [];
  const found = new Map<string, string>();
  for (const w of words) {
    const suggestion = COMMON_TYPOS[w];
    if (suggestion) found.set(w, suggestion);
  }
  return [...found.entries()].map(([word, suggestion]) => ({ word, suggestion })).slice(0, 8);
}
