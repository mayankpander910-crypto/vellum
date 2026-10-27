import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TooltipProvider } from "@/components/ui/misc";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: { default: "Vellum — Free Online Resume Builder", template: "%s | Vellum" },
  description: "Build a professional, job-ready resume in minutes. 50 free templates, live preview, PDF download. No sign-up, no hidden fees, and your data never leaves your browser.",
  applicationName: "Vellum Resume Builder",
  keywords: ["resume builder", "free resume", "CV maker", "resume templates", "PDF resume", "ATS resume"],
  authors: [{ name: "Vellum" }],
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: {
    title: "Vellum — Free Online Resume Builder",
    description: "50 professional templates, live preview and free PDF downloads. No account required.",
    type: "website",
    siteName: "Vellum",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#4c47e8" };

const themeInit = `try{var t=localStorage.getItem('vellum-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body className="min-h-screen">
        <ThemeProvider>
          <TooltipProvider delayDuration={250}>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="bottom-right" richColors closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
