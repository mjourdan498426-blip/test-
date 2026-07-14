"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#services", label: "Services" },
  { href: "#methode", label: "Méthode" },
  { href: "#a-propos", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 sm:px-6 transition-all duration-300 ${
          scrolled ? "glass shadow-lg shadow-black/20" : "border border-transparent"
        }`}
        aria-label="Navigation principale"
      >
        <a
          href="#top"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-1 to-accent-2 text-xs font-bold text-white">
            JM
          </span>
          <span className="hidden sm:inline">Jourdan&nbsp;Marc</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="btn-glow rounded-xl bg-gradient-to-r from-accent-1 to-accent-2 px-4 py-2 text-sm font-medium text-white"
        >
          Prendre rendez-vous
        </a>
      </nav>
    </header>
  );
}
