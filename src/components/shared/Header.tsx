import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { cn } from "#/lib/utils";

const SERVICES_CHILDREN = [
  { slug: "contract-drafting", label: "Contract Drafting" },
  { slug: "document-review", label: "Document Review" },
  { slug: "legal-research", label: "Legal Research" },
  { slug: "litigation-support", label: "Litigation Support" },
  { slug: "due-diligence", label: "Due Diligence" },
  { slug: "ip-support", label: "IP Support" },
  { slug: "paralegal-services", label: "Paralegal Services" },
] as const;

const NAV_LINKS = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { label: "Services", children: SERVICES_CHILDREN },
  { to: "/why-us" as const, label: "Why Us" },
  { to: "/testimonials" as const, label: "Testimonials" },
  { to: "/projects" as const, label: "Projects" },
  { to: "/blogs" as const, label: "Blogs" },
] as const;

const HEADER_INNER_H = "3.5rem"; /* h-14 */

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setMobileServicesOpen(false);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  const mobileNavTop = `calc(env(safe-area-inset-top, 0px) + ${HEADER_INNER_H})`;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex min-w-0 shrink items-center gap-2 text-sm font-semibold text-[var(--charcoal)] no-underline"
            onClick={closeMenu}
          >
            <span
              className="size-2 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--gold),var(--gold-light))]"
              aria-hidden
            />
            <span className="truncate sm:max-w-none">
              <span className="sm:hidden">Gayatri Law</span>
              <span className="hidden sm:inline">Gayatri Law Offices</span>
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) =>
              "children" in link ? (
                <div key={link.label} className="group relative">
                  <button
                    type="button"
                    className="nav-link flex cursor-pointer items-center gap-0.5 rounded-md px-2.5 py-2 text-sm font-medium"
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown
                      className="size-3 opacity-70 transition-transform duration-200 group-hover:rotate-180"
                      aria-hidden
                    />
                  </button>
                  <div className="absolute left-0 top-full z-50 hidden w-max min-w-52 pt-1 group-hover:block">
                    <div
                      className="rounded-2xl border border-[var(--line)] bg-[var(--header-bg)] p-1.5 shadow-lg backdrop-blur-xl"
                      role="menu"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.slug}
                          to="/services/$slug"
                          params={{ slug: child.slug }}
                          className="block rounded-xl px-3 py-2.5 text-sm text-[var(--charcoal-soft)] no-underline transition-colors hover:bg-[var(--link-bg-hover)] hover:text-[var(--charcoal)]"
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                      <Link
                        to="/services"
                        className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] no-underline transition-colors hover:bg-[var(--link-bg-hover)]"
                        role="menuitem"
                      >
                        View all services
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-link rounded-md px-2.5 py-2 text-sm font-medium"
                  activeProps={{ className: "nav-link is-active" }}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link to="/contact" className="hidden sm:block">
              <Button
                size="sm"
                className="rounded-full bg-[var(--gold)] px-3.5 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(184,134,11,0.25)] hover:bg-[var(--gold-deep)]"
              >
                Get a Quote
              </Button>
            </Link>
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-[var(--charcoal)] hover:bg-[var(--link-bg-hover)] lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed z-40 bg-black/25 backdrop-blur-[2px] lg:hidden"
            style={{ top: mobileNavTop, left: 0, right: 0, bottom: 0 }}
            onClick={closeMenu}
          />
          <div
            className="fixed z-40 flex max-h-[calc(100dvh-env(safe-area-inset-top,0px)-3.5rem)] flex-col overflow-y-auto border-t border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl lg:hidden"
            style={{ top: mobileNavTop, left: 0, right: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <nav
              className="mx-auto w-full max-w-md px-4 py-6 sm:px-6"
              aria-label="Mobile primary"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) =>
                  "children" in link ? (
                    <li key={link.label} className="list-none">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base font-semibold text-[var(--charcoal)] hover:bg-[var(--link-bg-hover)]"
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        aria-expanded={mobileServicesOpen}
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "size-4 shrink-0 transition-transform",
                            mobileServicesOpen && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>
                      {mobileServicesOpen ? (
                        <ul className="mt-1 flex flex-col gap-0.5 border-l-2 border-[var(--line)] pl-3 ml-3">
                          {link.children.map((child) => (
                            <li key={child.slug} className="list-none">
                              <Link
                                to="/services/$slug"
                                params={{ slug: child.slug }}
                                className="block rounded-md px-3 py-2 text-sm text-[var(--charcoal-soft)] no-underline hover:bg-[var(--link-bg-hover)] hover:text-[var(--charcoal)]"
                                onClick={closeMenu}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                          <li className="list-none">
                            <Link
                              to="/services"
                              className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--charcoal)] no-underline hover:bg-[var(--link-bg-hover)]"
                              onClick={closeMenu}
                            >
                              View all services
                            </Link>
                          </li>
                        </ul>
                      ) : null}
                    </li>
                  ) : (
                    <li key={link.to} className="list-none">
                      <Link
                        to={link.to}
                        className="block rounded-lg px-3 py-3 text-base font-semibold text-[var(--charcoal)] no-underline hover:bg-[var(--link-bg-hover)]"
                        activeProps={{
                          className:
                            "block rounded-lg px-3 py-3 text-base font-semibold text-[var(--gold)] no-underline hover:bg-[var(--link-bg-hover)]",
                        }}
                        onClick={closeMenu}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-8 sm:hidden">
                <Link to="/contact" className="block w-full" onClick={closeMenu}>
                  <Button className="w-full rounded-full bg-[var(--gold)] py-5 text-base font-semibold text-white hover:bg-[var(--gold-deep)]">
                    Get a Quote
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}
