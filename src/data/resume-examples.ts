import type { ResumeData, ResumeState } from "@/types/resume";
import { createEmptyState } from "@/lib/resume-utils";
import { emptyData } from "@/lib/resume-utils";

export interface ResumeExample {
  slug: string;
  title: string;
  role: string;
  level: "Student" | "Fresher" | "Mid-level" | "Senior";
  templateId: string;
  intro: string;
  highlights: string[];
  data: ResumeData;
}

function make(partial: Partial<ResumeData> & Pick<ResumeData, "personal">): ResumeData {
  return { ...emptyData(), ...partial };
}

const EXAMPLES: ResumeExample[] = [
  {
    slug: "computer-science-student", title: "Computer Science Student", role: "B.Tech CSE · Final year", level: "Student",
    templateId: "student-starter", intro: "An education-first resume that leads with coursework, projects and campus involvement when work experience is limited.",
    highlights: ["Education and projects appear before work history", "Coursework listed to show relevant theory", "Internship and club roles demonstrate initiative"],
    data: make({
      personal: {
        fullName: "Riya Desai", headline: "Computer Science Undergraduate", email: "riya.desai@example.com", phone: "+91 98790 11223",
        city: "Pune", country: "India", linkedin: "linkedin.com/in/riyadesai-example", github: "github.com/riyadesai-example", portfolio: "", website: "", photo: "",
        summary: "Final-year computer science student with a strong foundation in algorithms, web development and databases. Built three full-stack projects and completed a software engineering internship where I shipped a customer-facing feature used by 2,000 students.",
      },
      education: [{ id: "e1", institution: "Savitribai Phule Pune University", degree: "B.Tech", field: "Computer Science & Engineering", startDate: "2022", endDate: "2026", grade: "9.1 / 10 CGPA", details: "Relevant coursework: Algorithms, DBMS, Operating Systems, Computer Networks, Machine Learning." }],
      skills: [
        { id: "s1", category: "Languages", items: ["Python", "Java", "TypeScript", "SQL"] },
        { id: "s2", category: "Tools", items: ["React", "Node.js", "PostgreSQL", "Git", "Docker"] },
      ],
      projects: [
        { id: "p1", name: "CampusMart", description: "A student-to-student marketplace with listings, chat and UPI-ready checkout simulation.", technologies: "React, Node.js, PostgreSQL", url: "github.com/riyadesai-example/campusmart", achievements: ["Served 600+ registered students during the pilot", "Reduced listing search latency by 40% with indexed queries"] },
        { id: "p2", name: "StudyBuddy", description: "A spaced-repetition flashcard app with shared decks.", technologies: "Python, Flask, SQLite", url: "", achievements: ["Added an import pipeline that parses CSV decks in under a second"] },
      ],
      experience: [{ id: "x1", jobTitle: "Software Engineering Intern", company: "Brightpath EdTech", location: "Remote", startDate: "May 2025", endDate: "Jul 2025", current: false, description: "", bullets: ["Built an attendance dashboard used by 2,000 students across 12 courses", "Wrote integration tests that caught 18 regression bugs before release"] }],
      activities: [{ id: "a1", name: "ACM Student Chapter", role: "Events lead", details: "Organised six technical workshops with 400+ attendees." }],
      awards: [{ id: "aw1", name: "Winner, National Hackathon 2024", issuer: "TechFest India", date: "2024", details: "Built an accessible transport app in 36 hours." }],
    }),
  },
  {
    slug: "fresher", title: "Fresher Resume", role: "Entry-level generalist", level: "Fresher",
    templateId: "fresher-resume", intro: "A balanced first-job resume that gives equal weight to internships, academic projects and transferable skills.",
    highlights: ["Projects section placed above work experience", "Short, quantified achievement bullets", "Clean single-column layout for online applications"],
    data: make({
      personal: {
        fullName: "Kabir Nair", headline: "Business Analytics Graduate", email: "kabir.nair@example.com", phone: "+91 98120 44556",
        city: "Kochi", country: "India", linkedin: "linkedin.com/in/kabirnair-example", github: "", portfolio: "", website: "", photo: "",
        summary: "Business analytics graduate who enjoys turning messy operational data into simple decisions. Completed two analytics internships and built dashboards that helped small teams track sales, inventory and customer retention.",
      },
      education: [{ id: "e1", institution: "Cochin University of Science and Technology", degree: "B.Com", field: "Business Analytics", startDate: "2021", endDate: "2024", grade: "8.4 / 10", details: "Relevant coursework: Statistics, Econometrics, Data Visualisation, Operations Research." }],
      skills: [{ id: "s1", category: "Analytics", items: ["Excel", "SQL", "Power BI", "Python (pandas)", "A/B testing"] }],
      projects: [
        { id: "p1", name: "Retail Sales Dashboard", description: "An interactive Power BI dashboard covering three years of regional sales.", technologies: "Power BI, SQL, Excel", url: "", achievements: ["Identified a 12% margin leak in one product category", "Cut weekly reporting time from four hours to 20 minutes"] },
      ],
      experience: [{ id: "x1", jobTitle: "Analytics Intern", company: "Southwind Retail", location: "Kochi", startDate: "Jan 2024", endDate: "Apr 2024", current: false, description: "", bullets: ["Automated a daily inventory report for 14 stores", "Analysed 40,000 transactions to recommend a restocking schedule"] }],
      certifications: [{ id: "c1", name: "Google Data Analytics Certificate", issuer: "Coursera", date: "2024", url: "" }],
    }),
  },
  {
    slug: "frontend-developer", title: "Frontend Developer", role: "React / TypeScript", level: "Mid-level",
    templateId: "software-developer", intro: "A technical resume that foregrounds UI performance, accessibility and design-system work.",
    highlights: ["Metrics-first bullets (load time, adoption, coverage)", "Stack grouped by purpose", "Side projects show breadth beyond day job"],
    data: make({
      personal: {
        fullName: "Meera Iyer", headline: "Frontend Developer", email: "meera.iyer@example.com", phone: "+91 99450 77889",
        city: "Bengaluru", country: "India", linkedin: "linkedin.com/in/meeraiyer-example", github: "github.com/meeraiyer-example", portfolio: "meeraiyer.example.dev", website: "", photo: "",
        summary: "Frontend developer with four years of experience building accessible, fast interfaces for B2B products. Strong in React, TypeScript and design systems, with a habit of measuring the impact of every performance change.",
      },
      experience: [
        { id: "x1", jobTitle: "Frontend Developer", company: "Orbit Software", location: "Bengaluru", startDate: "Jun 2022", endDate: "", current: true, description: "", bullets: ["Rebuilt the reporting interface in React and TypeScript, reducing render time by 48%", "Created 45 accessible components adopted by five product squads", "Raised automated accessibility test coverage from 32% to 91%"] },
        { id: "x2", jobTitle: "Junior Web Developer", company: "Pixelworks Studio", location: "Bengaluru", startDate: "Aug 2020", endDate: "May 2022", current: false, description: "", bullets: ["Delivered 18 client websites with an average Lighthouse score of 94", "Introduced a shared CSS token system that cut styling time by 25%"] },
      ],
      education: [{ id: "e1", institution: "Visvesvaraya Technological University", degree: "B.E.", field: "Information Science", startDate: "2016", endDate: "2020", grade: "8.8 / 10", details: "" }],
      skills: [
        { id: "s1", category: "Core", items: ["React", "TypeScript", "Next.js", "CSS / Tailwind"] },
        { id: "s2", category: "Quality", items: ["Vitest", "Playwright", "axe-core", "Storybook"] },
      ],
      projects: [{ id: "p1", name: "TypeScale", description: "A browser tool for testing responsive type scales on real content.", technologies: "TypeScript, Vite", url: "github.com/meeraiyer-example/typescale", achievements: ["Used by 3,000+ designers in its first three months"] }],
    }),
  },
  {
    slug: "backend-developer", title: "Backend Developer", role: "APIs & distributed systems", level: "Mid-level",
    templateId: "backend-developer", intro: "A dark-rail technical template with a strong tooling stack and reliability-focused achievements.",
    highlights: ["Throughput and latency numbers up front", "Dedicated skills sidebar", "Incident and reliability outcomes described clearly"],
    data: make({
      personal: {
        fullName: "Dev Patel", headline: "Backend Engineer", email: "dev.patel@example.com", phone: "+91 98240 66557",
        city: "Hyderabad", country: "India", linkedin: "linkedin.com/in/devpatel-example", github: "github.com/devpatel-example", portfolio: "", website: "", photo: "",
        summary: "Backend engineer with five years designing APIs and event-driven services for high-traffic products. Focused on reliability, observability and making systems simple enough for the whole team to operate.",
      },
      experience: [
        { id: "x1", jobTitle: "Senior Backend Engineer", company: "Tidewave Technologies", location: "Hyderabad", startDate: "Feb 2022", endDate: "", current: true, description: "", bullets: ["Designed a payments API handling 1.8M requests per day at 99.98% availability", "Cut p99 latency from 840 ms to 210 ms by introducing caching and query optimisation", "Led a zero-downtime migration of 12 TB of data across database clusters"] },
        { id: "x2", jobTitle: "Backend Developer", company: "Coriander Labs", location: "Pune", startDate: "Jul 2019", endDate: "Jan 2022", current: false, description: "", bullets: ["Built an event-driven notification service processing 400k messages daily", "Added structured logging that reduced mean time to resolution by 35%"] },
      ],
      education: [{ id: "e1", institution: "BITS Pilani", degree: "B.E.", field: "Computer Science", startDate: "2015", endDate: "2019", grade: "8.2 / 10", details: "" }],
      skills: [
        { id: "s1", category: "Languages", items: ["Go", "Java", "Python", "SQL"] },
        { id: "s2", category: "Infrastructure", items: ["PostgreSQL", "Kafka", "Redis", "Kubernetes", "AWS"] },
      ],
      certifications: [{ id: "c1", name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", date: "2023", url: "" }],
    }),
  },
  {
    slug: "full-stack-developer", title: "Full-Stack Developer", role: "Product engineering", level: "Mid-level",
    templateId: "full-stack-developer", intro: "A two-column layout that captures a broad stack without losing the story of product delivery.",
    highlights: ["End-to-end ownership documented", "Stack split into frontend, backend and ops", "Open-source contribution highlighted"],
    data: make({
      personal: {
        fullName: "Sana Qureshi", headline: "Full-Stack Developer", email: "sana.qureshi@example.com", phone: "+91 99001 33445",
        city: "Remote", country: "India", linkedin: "linkedin.com/in/sanaqureshi-example", github: "github.com/sanaqureshi-example", portfolio: "sana.example.dev", website: "", photo: "",
        summary: "Full-stack developer who ships complete features from database to interface. Six years across early-stage teams, comfortable owning architecture decisions, delivery and the occasional on-call rotation.",
      },
      experience: [
        { id: "x1", jobTitle: "Full-Stack Engineer", company: "Lumen Health", location: "Remote", startDate: "Mar 2021", endDate: "", current: true, description: "", bullets: ["Owned the patient onboarding product end to end, lifting completion from 61% to 86%", "Migrated a monolith to modular services, cutting deploy time from 40 to 8 minutes", "Mentored four engineers and introduced a lightweight RFC process"] },
        { id: "x2", jobTitle: "Software Engineer", company: "Sprout Commerce", location: "Jaipur", startDate: "Jun 2018", endDate: "Feb 2021", current: false, description: "", bullets: ["Built a multi-vendor checkout supporting 300+ merchants", "Added automated tests that reduced production defects by 42%"] },
      ],
      education: [{ id: "e1", institution: "MNIT Jaipur", degree: "B.Tech", field: "Computer Science", startDate: "2014", endDate: "2018", grade: "8.5 / 10", details: "" }],
      skills: [
        { id: "s1", category: "Frontend", items: ["React", "TypeScript", "Next.js"] },
        { id: "s2", category: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Redis"] },
        { id: "s3", category: "Platform", items: ["Docker", "AWS", "GitHub Actions"] },
      ],
      projects: [{ id: "p1", name: "FormKit", description: "An open-source form builder with validation and conditional logic.", technologies: "TypeScript, React", url: "github.com/sanaqureshi-example/formkit", achievements: ["2,400 GitHub stars and 28 contributors"] }],
    }),
  },
  {
    slug: "data-analyst", title: "Data Analyst", role: "Insights & BI", level: "Mid-level",
    templateId: "data-analyst", intro: "A metrics-forward resume with a tabular header and numbered sections that emphasise business impact.",
    highlights: ["Every bullet contains a number", "Tools separated from analytical methods", "Clear stakeholder collaboration"],
    data: make({
      personal: {
        fullName: "Arjun Rao", headline: "Data Analyst", email: "arjun.rao@example.com", phone: "+91 98450 99001",
        city: "Mumbai", country: "India", linkedin: "linkedin.com/in/arjunrao-example", github: "", portfolio: "", website: "", photo: "",
        summary: "Data analyst with four years of experience in e-commerce and logistics. I turn ambiguous business questions into reproducible analysis and dashboards that teams actually use.",
      },
      experience: [
        { id: "x1", jobTitle: "Data Analyst", company: "Swiftcart", location: "Mumbai", startDate: "Apr 2022", endDate: "", current: true, description: "", bullets: ["Built a cohort retention model that informed a campaign increasing 90-day retention by 9%", "Automated 11 weekly reports, saving the operations team 18 hours per week", "Designed an experiment framework now used across three product teams"] },
        { id: "x2", jobTitle: "Junior Analyst", company: "Freightline Logistics", location: "Navi Mumbai", startDate: "Jul 2020", endDate: "Mar 2022", current: false, description: "", bullets: ["Analysed 1.2M shipment records to find routes with avoidable delays", "Created a Power BI dashboard used by 60 regional managers"] },
      ],
      education: [{ id: "e1", institution: "University of Mumbai", degree: "M.Sc.", field: "Statistics", startDate: "2018", endDate: "2020", grade: "First class", details: "" }],
      skills: [
        { id: "s1", category: "Tools", items: ["SQL", "Python", "Power BI", "dbt", "Excel"] },
        { id: "s2", category: "Methods", items: ["A/B testing", "Cohort analysis", "Regression", "Forecasting"] },
      ],
      certifications: [{ id: "c1", name: "Microsoft Power BI Data Analyst", issuer: "Microsoft", date: "2023", url: "" }],
    }),
  },
  {
    slug: "ai-ml-engineer", title: "AI/ML Engineer", role: "Applied machine learning", level: "Mid-level",
    templateId: "ai-ml-engineer", intro: "A research-adjacent layout that leaves room for publications, experiments and model deployment details.",
    highlights: ["Model metrics with baselines", "Publication and experiment sections", "MLOps experience described alongside modelling"],
    data: make({
      personal: {
        fullName: "Ishita Verma", headline: "Machine Learning Engineer", email: "ishita.verma@example.com", phone: "+91 98110 22334",
        city: "Gurugram", country: "India", linkedin: "linkedin.com/in/ishitaverma-example", github: "github.com/ishitaverma-example", portfolio: "", website: "", photo: "",
        summary: "Machine learning engineer with four years building and deploying NLP models in production. Interested in evaluation, data quality and systems that stay reliable after launch.",
      },
      experience: [
        { id: "x1", jobTitle: "Machine Learning Engineer", company: "Lexica AI", location: "Gurugram", startDate: "Jan 2022", endDate: "", current: true, description: "", bullets: ["Improved intent classification F1 from 0.79 to 0.91 with better data curation", "Deployed a distilled model that cut inference cost by 62% while keeping accuracy within 1%", "Built an evaluation suite covering 14 failure modes, reducing regressions by 70%"] },
        { id: "x2", jobTitle: "Data Scientist", company: "Northfield Research", location: "Delhi", startDate: "Aug 2020", endDate: "Dec 2021", current: false, description: "", bullets: ["Developed a document ranking model for a corpus of 3M legal texts", "Created a labelling workflow that increased annotator agreement to 0.88"] },
      ],
      education: [{ id: "e1", institution: "IIT Delhi", degree: "M.Tech", field: "Computer Science (AI)", startDate: "2018", endDate: "2020", grade: "8.9 / 10", details: "" }],
      publications: [{ id: "pu1", title: "Evaluating Low-Resource Intent Classifiers", publisher: "Proceedings of ACL SRW", date: "2021", url: "", details: "Compared four architectures across five low-resource languages." }],
      skills: [
        { id: "s1", category: "Modelling", items: ["PyTorch", "Transformers", "scikit-learn", "XGBoost"] },
        { id: "s2", category: "Production", items: ["FastAPI", "Docker", "MLflow", "Airflow", "AWS SageMaker"] },
      ],
    }),
  },
  {
    slug: "ui-ux-designer", title: "UI/UX Designer", role: "Product design", level: "Mid-level",
    templateId: "ui-ux-designer", intro: "A portfolio-style resume that describes research, decisions and outcomes rather than listing screens.",
    highlights: ["Case-study-style project blocks", "Research methods named explicitly", "Business outcomes tied to design decisions"],
    data: make({
      personal: {
        fullName: "Naina Kapoor", headline: "Product Designer (UI/UX)", email: "naina.kapoor@example.com", phone: "+91 98730 55667",
        city: "Ahmedabad", country: "India", linkedin: "linkedin.com/in/nainakapoor-example", github: "", portfolio: "nainakapoor.example.design", website: "", photo: "",
        summary: "Product designer with five years shaping B2B and consumer products. I combine research, interaction design and a working knowledge of frontend code to make interfaces that feel obvious.",
      },
      experience: [
        { id: "x1", jobTitle: "Senior Product Designer", company: "Canvas Cloud", location: "Remote", startDate: "Sep 2021", endDate: "", current: true, description: "", bullets: ["Led an end-to-end redesign of the onboarding flow, improving activation by 24%", "Ran 32 usability sessions that reframed the navigation information architecture", "Built and documented a design system of 120 components used by six teams"] },
        { id: "x2", jobTitle: "UI/UX Designer", company: "Studio Mango", location: "Ahmedabad", startDate: "Jun 2019", endDate: "Aug 2021", current: false, description: "", bullets: ["Designed nine client products across fintech, healthcare and logistics", "Introduced a prototype-first process that cut design review cycles by a third"] },
      ],
      education: [{ id: "e1", institution: "National Institute of Design", degree: "B.Des", field: "Communication Design", startDate: "2015", endDate: "2019", grade: "", details: "" }],
      skills: [
        { id: "s1", category: "Design", items: ["Figma", "User research", "Interaction design", "Prototyping", "Design systems"] },
        { id: "s2", category: "Collaboration", items: ["HTML/CSS literacy", "Workshop facilitation", "Design QA"] },
      ],
      projects: [{ id: "p1", name: "Accessibility audit — Meru Bank", description: "A WCAG 2.2 AA audit and redesign of a retail banking app.", technologies: "Figma, axe, Maze", url: "", achievements: ["Resolved 96 accessibility issues across 14 screens", "Raised task success from 68% to 89% in moderated tests"] }],
    }),
  },
  {
    slug: "marketing-professional", title: "Marketing Professional", role: "Growth & content", level: "Mid-level",
    templateId: "marketing-professional", intro: "A warm, campaign-oriented template where each achievement is tied to a measurable growth result.",
    highlights: ["Channel mix described clearly", "Traffic, CPL and conversion numbers", "Content and paid acquisition combined"],
    data: make({
      personal: {
        fullName: "Rohit Menon", headline: "Growth Marketing Manager", email: "rohit.menon@example.com", phone: "+91 98470 11882",
        city: "Bengaluru", country: "India", linkedin: "linkedin.com/in/rohitmenon-example", github: "", portfolio: "", website: "", photo: "",
        summary: "Growth marketer with six years across SEO, content and paid acquisition for B2B SaaS. Comfortable owning strategy, budget and execution, with a bias towards experiments that can be measured.",
      },
      experience: [
        { id: "x1", jobTitle: "Growth Marketing Manager", company: "Clario Software", location: "Bengaluru", startDate: "Jan 2021", endDate: "", current: true, description: "", bullets: ["Grew organic traffic 3.2× in 18 months through a topic-cluster content programme", "Reduced cost per qualified lead by 31% while increasing volume by 22%", "Built a lifecycle email programme contributing 18% of new trials"] },
        { id: "x2", jobTitle: "Digital Marketing Specialist", company: "Cropstone", location: "Kochi", startDate: "Jul 2018", endDate: "Dec 2020", current: false, description: "", bullets: ["Managed ₹45 lakh annual paid media budget across Google and LinkedIn", "Launched a referral campaign that added 1,400 sign-ups in five months"] },
      ],
      education: [{ id: "e1", institution: "Symbiosis International University", degree: "MBA", field: "Marketing", startDate: "2016", endDate: "2018", grade: "", details: "" }],
      skills: [{ id: "s1", category: "Growth", items: ["SEO", "Google Ads", "LinkedIn Ads", "Marketing automation", "GA4", "A/B testing"] }],
      certifications: [{ id: "c1", name: "Google Analytics Certification", issuer: "Google", date: "2023", url: "" }],
    }),
  },
  {
    slug: "experienced-professional", title: "Experienced Professional", role: "Operations leadership", level: "Senior",
    templateId: "experienced-professional", intro: "An executive-style two-page resume with a strong header, leadership narrative and selected career highlights.",
    highlights: ["Leadership scope stated in the summary", "Selected achievements separated from duties", "Board and cross-functional work included"],
    data: make({
      personal: {
        fullName: "Vikram Sethi", headline: "Head of Operations", email: "vikram.sethi@example.com", phone: "+91 98200 77881",
        city: "Delhi NCR", country: "India", linkedin: "linkedin.com/in/vikramsethi-example", github: "", portfolio: "", website: "", photo: "",
        summary: "Operations leader with 15 years of experience scaling service and manufacturing teams across India and Southeast Asia. Known for building repeatable processes, improving margins and developing managers who go on to lead their own functions.",
      },
      experience: [
        { id: "x1", jobTitle: "Head of Operations", company: "Meridian Industries", location: "Gurugram", startDate: "Apr 2019", endDate: "", current: true, description: "Lead a 240-person operations organisation across four sites.", bullets: ["Improved gross margin by 6.4 points over three years through process redesign", "Reduced order-to-delivery time from 11 days to 6 days", "Built a leadership programme that promoted 19 internal managers"] },
        { id: "x2", jobTitle: "Senior Operations Manager", company: "Tandem Logistics", location: "Singapore", startDate: "Jun 2014", endDate: "Mar 2019", current: false, description: "", bullets: ["Opened two new regional hubs on time and 8% under budget", "Introduced a quality programme that cut customer escalations by 44%"] },
        { id: "x3", jobTitle: "Operations Manager", company: "Bluepeak Services", location: "Mumbai", startDate: "Jul 2010", endDate: "May 2014", current: false, description: "", bullets: ["Managed a 60-person field team across western India", "Standardised vendor onboarding, reducing setup time by 30%"] },
      ],
      education: [{ id: "e1", institution: "IIM Ahmedabad", degree: "PGDM", field: "Operations", startDate: "2008", endDate: "2010", grade: "", details: "" }],
      skills: [{ id: "s1", category: "Leadership", items: ["P&L ownership", "Process improvement", "Vendor management", "Change management", "Lean Six Sigma"] }],
      awards: [{ id: "a1", name: "Operational Excellence Award", issuer: "Meridian Industries", date: "2022", details: "Awarded for the multi-site margin improvement programme." }],
      languages: [{ id: "l1", name: "English", proficiency: "Fluent" }, { id: "l2", name: "Hindi", proficiency: "Native" }],
    }),
  },
];

export const RESUME_EXAMPLES = EXAMPLES;

export function getExampleBySlug(slug: string): ResumeExample | undefined {
  return EXAMPLES.find((e) => e.slug === slug);
}

export function exampleToState(example: ResumeExample, templateId?: string): ResumeState {
  const base = createEmptyState(templateId ?? example.templateId);
  return { ...base, data: JSON.parse(JSON.stringify(example.data)) as ResumeData };
}

export function exampleHref(example: ResumeExample): string {
  return `/builder/?example=${encodeURIComponent(example.slug)}`;
}
