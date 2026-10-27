import type { ResumeData, ResumeState } from "@/types/resume";
import { createEmptyState } from "@/lib/resume-utils";

/** Fictional demonstration data. Never leaves the browser. */
export function sampleData(): ResumeData {
  return {
    personal: {
      fullName: "Aarav Mehta",
      headline: "Senior Frontend Engineer",
      email: "aarav.mehta@example.com",
      phone: "+91 98250 12345",
      city: "Ahmedabad",
      country: "India",
      linkedin: "linkedin.com/in/aaravmehta-example",
      github: "github.com/aaravmehta-example",
      portfolio: "aaravmehta.example.dev",
      website: "",
      photo: "",
      summary:
        "Frontend engineer with 6+ years building fast, accessible web products for SaaS and fintech teams. I specialise in design systems, performance, and turning ambiguous product ideas into shipped interfaces. Comfortable leading projects from discovery through rollout while mentoring junior developers.",
    },
    experience: [
      {
        id: "exp_1", jobTitle: "Senior Frontend Engineer", company: "Northstar Labs",
        location: "Remote", startDate: "Apr 2022", endDate: "", current: true, description: "",
        bullets: [
          "Led the rebuild of the analytics dashboard in Next.js and TypeScript, cutting median page load from 4.1s to 1.6s for 40,000 monthly users.",
          "Created a reusable component library of 60+ accessible components, reducing feature delivery time by roughly 30% across four product teams.",
          "Partnered with design to launch a dark theme and new navigation, improving task-completion rate from 71% to 88% in usability tests.",
        ],
      },
      {
        id: "exp_2", jobTitle: "Frontend Developer", company: "Clarity Fintech",
        location: "Bengaluru, India", startDate: "Jul 2019", endDate: "Mar 2022", current: false, description: "",
        bullets: [
          "Built customer-facing onboarding flows with React and Formik, increasing completed applications by 22% quarter over quarter.",
          "Reduced bundle size by 38% through code splitting, lazy loading and dependency audits.",
        ],
      },
    ],
    education: [
      {
        id: "edu_1", institution: "Nirma University", degree: "B.Tech", field: "Computer Science & Engineering",
        startDate: "2015", endDate: "2019", grade: "8.7 / 10 CGPA",
        details: "Relevant coursework: Data Structures, Human–Computer Interaction, Distributed Systems, Database Management.",
      },
    ],
    skills: [
      { id: "sk_1", category: "Languages", items: ["TypeScript", "JavaScript (ES2022)", "HTML5", "CSS3", "SQL"] },
      { id: "sk_2", category: "Frameworks & Tools", items: ["React", "Next.js", "Tailwind CSS", "Node.js", "Vitest", "Playwright"] },
    ],
    projects: [
      {
        id: "pr_1", name: "OpenSheet — collaborative spreadsheets", description: "An offline-first spreadsheet app with real-time collaboration and keyboard-first navigation.",
        technologies: "React, TypeScript, IndexedDB, CRDTs", url: "github.com/aaravmehta-example/opensheet",
        achievements: [
          "Implemented a conflict-free replicated data type layer supporting simultaneous edits from 12 peers.",
        ],
      },
    ],
    certifications: [
      { id: "ce_1", name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "2023", url: "" },
      { id: "ce_2", name: "Professional Scrum Master I", issuer: "Scrum.org", date: "2022", url: "" },
    ],
    languages: [
      { id: "la_1", name: "English", proficiency: "Professional working proficiency" },
      { id: "la_2", name: "Hindi", proficiency: "Native" },
    ],
    awards: [], volunteer: [], publications: [], courses: [], activities: [],
    interests: ["Open-source software", "Urban sketching", "Long-distance cycling"],
    references: [], customSections: [],
  };
}

export function sampleState(templateId?: string): ResumeState {
  const base = createEmptyState(templateId);
  return { ...base, data: sampleData() };
}
