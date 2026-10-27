"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/builder", label: "Resume Builder" },
  { href: "/examples", label: "Examples" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b transition-all duration-300",
      scrolled ? "border-border bg-background/90 shadow-sm backdrop-blur-xl" : "border-transparent bg-background/70 backdrop-blur-sm",
    )}>
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Vellum home" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Logo />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors",
                isActive(pathname, link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          <ThemeToggle />
          <Button asChild size="sm" className="h-9 px-4">
            <Link href="/builder">Create My Resume <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-5 pb-5 pt-3 lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn("rounded-lg px-3 py-2.5 text-sm font-semibold", isActive(pathname, link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary")}>
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2 w-full"><Link href="/builder">Create My Resume <ArrowRight className="h-4 w-4" /></Link></Button>
          </nav>
        </div>
      )}
    </header>
  );
}
