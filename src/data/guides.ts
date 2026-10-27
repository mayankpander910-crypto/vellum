export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  tip?: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: "Getting started" | "Writing" | "Career stage" | "Templates & ATS";
  readMinutes: number;
  updated: string;
  intro: string;
  sections: GuideSection[];
  relatedTemplates: string[];
  relatedExamples?: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: "fresher-resume-guide",
    title: "How to Write a Resume as a Fresher",
    description: "A practical, step-by-step guide for students and first-time job seekers with little or no formal work experience.",
    category: "Career stage",
    readMinutes: 7,
    updated: "2026-09-12",
    intro: "When you have not held a full-time job yet, a resume can feel impossible to fill. It is not. Employers hiring freshers care about evidence of ability: projects, internships, coursework, competitions and the way you explain your work. This guide shows you how to build that evidence into a clear one-page resume.",
    sections: [
      {
        heading: "Start with the sections that show the most evidence",
        paragraphs: ["Most fresher resumes should lead with a short summary, then education, projects, skills and finally any internships or part-time work. That order is different from an experienced professional's resume, and that is fine.", "Put your strongest evidence directly under your contact details. If you completed a substantial final-year project, it deserves to be visible in the first third of the page."],
        bullets: ["Summary: 2–3 lines naming your field and strongest skills", "Education: degree, institution, graduation year, grade if strong", "Projects: 2–3 with a description, stack and one measurable outcome", "Skills: grouped into languages, tools and concepts", "Experience: internships, freelance work, volunteering or campus roles"],
        tip: "Everything on a one-page fresher resume should help the reader decide you can do the job. Cut unrelated secondary-school details once you are at university.",
      },
      {
        heading: "Turn academic projects into work experience",
        paragraphs: ["A project is only impressive if the reader understands what you built and why it mattered. Describe the problem, the tools you chose, your specific contribution and the result.", "Avoid writing a feature list. Instead, explain one or two decisions you made and what happened because of them."],
      },
      {
        heading: "Write bullets that show action and outcome",
        paragraphs: ["Start each bullet with a verb: built, analysed, designed, automated, tested, presented. Then add a number where you honestly can — users, records, response time, marks, team size or time saved.", "Weak: “Worked on a website for the college fest.” Better: “Built a ticketing site for the college fest that handled 1,200 registrations in its first week.”"],
      },
      {
        heading: "Keep it to one page and proofread carefully",
        paragraphs: ["A single A4 or US Letter page is almost always right for a fresher. Use a clean, single-column template with standard section headings so online application systems can read it.", "Read the final document out loud, then ask a friend to check it. Spelling errors are one of the most common reasons a first resume gets skipped."],
        tip: "Use Vellum's completeness checklist and writing assistant for editable example summaries and bullet templates — they run locally in your browser.",
      },
    ],
    relatedTemplates: ["student-starter", "fresher-resume", "project-focused-resume", "campus-placement"],
    relatedExamples: ["computer-science-student", "fresher"],
  },
  {
    slug: "professional-summary",
    title: "How to Write a Strong Professional Summary",
    description: "A simple formula for the two to four lines at the top of your resume, with examples you can adapt.",
    category: "Writing",
    readMinutes: 6,
    updated: "2026-08-28",
    intro: "Your professional summary is the first thing a recruiter reads after your name. It is not an objective (“seeking a challenging role”) and it is not a cover letter. It is a compact argument for why your experience fits this role.",
    sections: [
      {
        heading: "Use a four-part formula",
        paragraphs: ["A reliable summary answers: who you are professionally, how much or what kind of experience you have, what you are especially good at, and what measurable value you have delivered.", "For example: “Frontend engineer with 6+ years building accessible web products for SaaS teams. Specialises in design systems and performance. Cut median page load from 4.1s to 1.6s for 40,000 monthly users.”"],
        bullets: ["Role + experience: “Data analyst with four years in e-commerce…”", "Specialism: “…focused on SQL, experimentation and dashboard design”", "Evidence: one metric, outcome or scale", "Direction: the kind of role you are targeting, if relevant"],
      },
      {
        heading: "Keep it short and specific",
        paragraphs: ["Two to four lines is enough. Remove adjectives that cannot be proven: hard-working, passionate, dynamic, results-driven. Replace them with facts.", "Avoid first-person pronouns and avoid repeating your job titles verbatim — the experience section already lists those."],
      },
      {
        heading: "Adapt it for each application",
        paragraphs: ["Change two or three words to mirror the job description. If the posting emphasises stakeholder management, use that phrase if it genuinely describes your work. This helps both human readers and applicant tracking systems.", "Never paste the same summary into every application without reading the posting first."],
        tip: "Vellum includes editable example summaries for freshers, developers, analysts, designers, marketers, managers and career changers. Insert one, then rewrite it in your own words.",
      },
      {
        heading: "Common mistakes",
        paragraphs: ["Writing an objective instead of a summary; listing soft skills with no evidence; using jargon or acronyms the reader may not know; and making the summary longer than the experience section.", "A good test: cover the summary with your hand. Does the rest of the resume still tell the same story? If not, fix the story."],
      },
    ],
    relatedTemplates: ["modern-minimal", "classic-professional", "career-change-resume"],
  },
  {
    slug: "describing-projects-on-a-resume",
    title: "How to Describe Projects on a Resume",
    description: "Make personal, academic and open-source projects read like credible professional evidence.",
    category: "Writing",
    readMinutes: 6,
    updated: "2026-08-15",
    intro: "Projects are often the strongest part of a student or career-change resume, but only when they are described clearly. A project entry should help a stranger understand what you built in under ten seconds.",
    sections: [
      {
        heading: "Use a repeatable structure",
        paragraphs: ["Name the project, describe the problem in one sentence, list the key technologies, then give one or two achievement lines. If there is a live link or repository, include it.", "Keep the description factual. Save opinions like “beautiful” or “innovative” for a portfolio where the reader can see the work."],
        bullets: ["Project name — short and descriptive", "One-line description of the problem and users", "Technologies — 3 to 6 relevant tools, not a keyword dump", "Highlights — 1–3 bullets with outcomes", "Link — GitHub, live demo, case study or publication"],
      },
      {
        heading: "Quantify what you can",
        paragraphs: ["Numbers make a project concrete: users, records processed, latency, accuracy, GitHub stars, contest rank, hours saved. If you do not have external numbers, describe technical scale: “handled 12 simultaneous editors” or “processed 40,000 rows per run.”"],
      },
      {
        heading: "Show your own contribution",
        paragraphs: ["For team projects, say what you personally owned. “Implemented the conflict-resolution layer” is more useful than “worked on collaboration.”", "If the project was part of coursework, say so briefly. There is no need to apologise for academic work — describe it professionally."],
        tip: "Order projects by relevance, not by date. Put the one that best matches the job first.",
      },
      {
        heading: "Choose the right template",
        paragraphs: ["Project-heavy resumes work best with a template that places Projects near the top. Vellum's Project-Focused Resume, Fresher Resume and Entry-Level Technical templates use that order by default.", "You can also reorder sections manually in the Customize panel."],
      },
    ],
    relatedTemplates: ["project-focused-resume", "fresher-resume", "entry-level-technical"],
    relatedExamples: ["computer-science-student", "ui-ux-designer"],
  },
  {
    slug: "achievement-focused-bullets",
    title: "How to Write Achievement-Focused Bullet Points",
    description: "Turn a list of duties into a set of results with a simple verb + action + outcome structure.",
    category: "Writing",
    readMinutes: 5,
    updated: "2026-08-02",
    intro: "“Responsible for reports” tells a recruiter what your job description said. “Automated 11 weekly reports, saving 18 hours per week” tells them what you achieved. That difference is the single highest-return edit you can make to a resume.",
    sections: [
      {
        heading: "The three-part bullet",
        paragraphs: ["Start with a strong action verb, describe what you did, and finish with the result. If you cannot include a number, describe the scope or the change in behaviour.", "Before: “Responsible for the company website.” After: “Rebuilt the marketing site in Next.js, cutting load time from 4.1s to 1.6s and increasing demo requests by 18%.”"],
        bullets: ["Verb: Built, Reduced, Launched, Automated, Analysed, Led, Negotiated", "Action: what you actually did, in plain language", "Outcome: a number, a before/after comparison or a scale"],
      },
      {
        heading: "Find numbers you already have",
        paragraphs: ["You probably have more data than you think. Check dashboards, sprint reports, invoices, class sizes, ticket volumes and calendar invites. Reasonable estimates are acceptable if you label them as approximate.", "Useful categories: money, time, people, volume, frequency, quality, rank, geography and risk."],
      },
      {
        heading: "Keep bullets tidy",
        paragraphs: ["Aim for one or two lines per bullet, around 15–30 words. Use past tense for previous roles and present tense for your current role. Keep punctuation consistent, and do not add a full stop if your template uses none.", "Three or four strong bullets per role is usually enough. Older roles can have one or two."],
        tip: "Vellum's writing assistant contains editable bullet examples and a list of strong action verbs. Copy one, then replace the details with your own.",
      },
      {
        heading: "Avoid these traps",
        paragraphs: ["Do not invent metrics, do not stuff keywords, do not repeat the same verb five times, and do not paste your entire job description. A bullet list is a highlight reel, not a transcript."],
      },
    ],
    relatedTemplates: ["simple-ats-friendly", "modern-corporate", "software-developer"],
  },
  {
    slug: "common-resume-mistakes",
    title: "10 Common Resume Mistakes (and Easy Fixes)",
    description: "A practical editing checklist covering content, formatting and application hygiene.",
    category: "Getting started",
    readMinutes: 6,
    updated: "2026-07-20",
    intro: "Most rejected resumes do not fail because the candidate was unqualified. They fail because the document was hard to read, vague, or clearly not adapted to the role. Here are ten fixes you can make in under an hour.",
    sections: [
      {
        heading: "Content mistakes",
        paragraphs: ["The first five problems are about what you say."],
        bullets: ["Vague duties instead of outcomes — rewrite with verb + action + result", "One generic summary for every job — mirror the posting's language", "Irrelevant detail (age, marital status, full address) — remove it", "Unexplained employment gaps — a short honest note is fine", "Inflated or unverifiable claims — keep everything defensible"],
      },
      {
        heading: "Formatting mistakes",
        paragraphs: ["The second five are about how it looks and travels.", "Use a single readable font at 9.5–11 pt, consistent date formats, and enough whitespace that a recruiter can scan the page in fifteen seconds. Avoid dense walls of text and tiny margins."],
        bullets: ["Inconsistent dates and punctuation — standardise them", "Tiny fonts and cramped margins — keep 10 pt and sensible margins", "Too many colours or graphics — one accent colour is enough", "Wrong page size for the country — use A4 or US Letter as appropriate", "Untested PDF — open the exported file on your phone before sending"],
        tip: "Always open your downloaded PDF and search for your own name inside it. If search cannot find your text, the file is an image and an ATS may not read it.",
      },
      {
        heading: "A final 60-second review",
        paragraphs: ["Check contact details, spelling of the company name, dates, and that the file name looks professional. Then read the first third of the page — that is the part that gets the most attention.", "Export a JSON backup from Vellum before you close the tab if you plan to edit again later."],
      },
    ],
    relatedTemplates: ["simple-ats-friendly", "modern-minimal", "compact-one-page"],
  },
  {
    slug: "choosing-a-resume-template",
    title: "How to Choose the Right Resume Template",
    description: "Match layout choices to your industry, experience level and the way you will apply.",
    category: "Templates & ATS",
    readMinutes: 6,
    updated: "2026-07-08",
    intro: "A template should make your content easier to read, not become the story. The right choice depends on where you are in your career and how your application will be processed.",
    sections: [
      {
        heading: "Consider how you will apply",
        paragraphs: ["If you are applying through a large company's online portal, an applicant tracking system will probably parse your resume first. In that case, a single-column template with standard section headings and no photos or graphics is safest.", "If you are emailing a hiring manager directly, applying to a design role, or handing over a printed copy at a career fair, you have more freedom to use a two-column or creative layout."],
        bullets: ["Job portals → ATS-friendly single column", "Direct email or referral → modern or two-column", "Creative roles → editorial or portfolio styles", "Academic applications → long-form CV layouts with publications"],
      },
      {
        heading: "Match the density to your experience",
        paragraphs: ["A student with three projects needs generous spacing and larger type to fill a page naturally. A senior engineer with ten years of history needs a compact layout with tighter spacing and a smaller font.", "Vellum templates use different densities by default, and you can fine-tune font size, line spacing, section spacing and margins in the Customize panel."],
      },
      {
        heading: "Check page size for the country",
        paragraphs: ["A4 is standard in India, the UK, Europe and most of the world. US Letter is standard in the United States and Canada. Vellum supports both, and switching page size reflows the preview and the PDF automatically.", "If you are unsure, use A4 — it is a safe international default."],
      },
      {
        heading: "Switching is cheap — do it",
        paragraphs: ["Because your content is stored separately from the design, you can try several templates in a minute. Compare two or three and pick the one where your strongest section appears highest on the page.", "Before you finalise, download the PDF and open it on a second device to check that nothing shifted."],
      },
    ],
    relatedTemplates: ["simple-ats-friendly", "modern-minimal", "creative-portfolio", "academic-cv", "international-resume"],
  },
  {
    slug: "ats-readable-resume",
    title: "How to Make a Resume More ATS-Readable",
    description: "A realistic guide to applicant tracking systems, what they can parse, and what no tool can guarantee.",
    category: "Templates & ATS",
    readMinutes: 7,
    updated: "2026-06-25",
    intro: "Applicant tracking systems (ATS) are databases that store and search candidate documents. Most modern systems can read a well-structured PDF, but parsing is imperfect — especially with unusual layouts. This guide focuses on things that genuinely improve your odds, without pretending any tool can guarantee a score.",
    sections: [
      {
        heading: "Use standard structure",
        paragraphs: ["ATS software looks for familiar section names and patterns. Use headings like Work Experience, Education, Skills and Projects. Creative headings such as “My Journey” may look nice but can be missed.", "Put contact details as real text in the body of the document, not in an image, header or footer."],
        bullets: ["Standard section headings", "Single-column reading order", "Plain-text email and phone", "Consistent date format such as “Jan 2023 – Mar 2025”", "No critical information inside images, tables or text boxes"],
      },
      {
        heading: "Choose a parseable file",
        paragraphs: ["A text-based PDF is widely accepted. Vellum's PDF export embeds fonts and writes real, selectable text; you can verify this by opening the PDF and searching for your name. Avoid exporting a screenshot as your resume.", "Some employers still request a .docx file. In that case, follow their instruction — Vellum does not currently generate Word documents, so you would need to recreate the resume in a word processor."],
        tip: "Vellum's direct PDF export uses embedded DejaVu fonts with selectable text. The Print → Save as PDF option produces a pixel-faithful version of the on-screen layout, also with selectable text.",
      },
      {
        heading: "Mirror keywords honestly",
        paragraphs: ["Read the job description and note the skills and tools it repeats. If you genuinely have those skills, use the same words in your summary, skills and experience bullets.", "Do not stuff invisible keywords, white text or long irrelevant lists — modern parsers and human reviewers both notice."],
      },
      {
        heading: "What no tool can promise",
        paragraphs: ["No builder can guarantee that a particular ATS will parse every field correctly, and no “ATS score” can guarantee an interview. Vellum provides a local readability checklist to help you avoid common problems, but the final check is always to read the job posting, follow its instructions, and review the exported PDF yourself."],
      },
    ],
    relatedTemplates: ["simple-ats-friendly", "simple-black-and-white", "formal-minimal", "compact-one-page"],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
