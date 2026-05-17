import { useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";

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
  { to: "/resources" as const, label: "Resources" },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesHover, setServicesHover] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setMobileServicesOpen(false);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-1/2 z-50 mt-5 -translate-x-1/2 sm:mt-6">
        <nav className="flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--header-bg)] px-2.5 py-2 shadow-[0_8px_32px_rgba(26,29,35,0.06)] backdrop-blur-2xl sm:gap-2 sm:px-3.5 sm:py-2.5">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-[var(--charcoal)] no-underline sm:px-2.5"
            onClick={closeMenu}
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,var(--gold),var(--gold-light))]" />
            <span className="hidden sm:inline">Gayatri Law Offices</span>
            <span className="sm:hidden">GLO</span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) =>
              "children" in link ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setServicesHover(true)}
                  onMouseLeave={() => setServicesHover(false)}
                >
                  <button className="nav-link cursor-pointer px-2.5 py-1.5 text-sm font-medium">
                    {link.label}
                    <svg
                      className="ml-0.5 inline-block size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {servicesHover && (
                    <div className="absolute left-0 top-full mt-1.5 min-w-52 rounded-2xl border border-[var(--line)] bg-[var(--header-bg)] p-1.5 shadow-[0_16px_48px_rgba(26,29,35,0.08)] backdrop-blur-2xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.slug}
                          to="/services/$slug"
                          params={{ slug: child.slug }}
                          className="block rounded-xl px-3 py-2.5 text-sm text-[var(--charcoal-soft)] no-underline transition-colors hover:bg-[var(--link-bg-hover)] hover:text-[var(--charcoal)]"
                          onClick={() => setServicesHover(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                      <Link
                        to="/services"
                        className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] no-underline transition-colors hover:bg-[var(--link-bg-hover)]"
                        onClick={() => setServicesHover(false)}
                      >
                        View All Services →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-link px-2.5 py-1.5 text-sm font-medium"
                  activeProps={{ className: "nav-link is-active" }}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <Link to="/contact" className="hidden sm:block">
              <Button
                size="sm"
                className="cursor-pointer rounded-full bg-[var(--gold)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(184,134,11,0.25)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] hover:shadow-[0_4px_14px_rgba(184,134,11,0.35)] active:scale-[0.97]"
              >
                Get a Quote
              </Button>
            </Link>
            <ThemeToggle />
            <button
              className="flex cursor-pointer flex-col items-center justify-center gap-[4.5px] rounded-full p-2 transition-colors hover:bg-[var(--link-bg-hover)] lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span
                className={`block h-[1.5px] w-5 rounded-full bg-[var(--charcoal)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`block h-[1.5px] w-5 rounded-full bg-[var(--charcoal)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? "scale-x-0 opacity-0" : ""}`}
              />
              <span
                className={`block h-[1.5px] w-5 rounded-full bg-[var(--charcoal)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[var(--header-bg)] backdrop-blur-3xl lg:hidden">
          <nav className="mt-24 flex flex-col items-center gap-5 px-6 pb-12">
            {NAV_LINKS.map((link, i) =>
              "children" in link ? (
                <div
                  key={link.label}
                  className="flex w-full flex-col items-center gap-2"
                >
                  <button
                    className="flex items-center gap-1 text-lg font-semibold text-[var(--charcoal)]"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    style={{
                      opacity: 0,
                      animation: `rise-in 600ms cubic-bezier(0.32,0.72,0,1) ${150 + i * 80}ms forwards`,
                    }}
                  >
                    {link.label}
                    <svg
                      className={`size-4 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {mobileServicesOpen && (
                    <div className="flex flex-col items-center gap-1.5">
                      {link.children.map((child) => (
                        <Link
                          key={child.slug}
                          to="/services/$slug"
                          params={{ slug: child.slug }}
                          className="text-base text-[var(--charcoal-soft)] no-underline transition-colors hover:text-[var(--charcoal)]"
                          onClick={closeMenu}
                        >
                          {child.label}
                        </Link>
                      ))}
                      <Link
                        to="/services"
                        className="text-base font-medium text-[var(--charcoal)] no-underline"
                        onClick={closeMenu}
                      >
                        View All Services
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-lg font-semibold text-[var(--charcoal)] no-underline"
                  activeProps={{ className: "text-[var(--gold)]" }}
                  onClick={closeMenu}
                  style={{
                    opacity: 0,
                    animation: `rise-in 600ms cubic-bezier(0.32,0.72,0,1) ${150 + i * 80}ms forwards`,
                  }}
                >
                  {link.label}
                </Link>
              ),
            )}
            <div
              className="mt-6"
              style={{
                opacity: 0,
                animation: `rise-in 600ms cubic-bezier(0.32,0.72,0,1) ${150 + NAV_LINKS.length * 80}ms forwards`,
              }}
            >
              <Link to="/contact" onClick={closeMenu}>
                <Button className="cursor-pointer rounded-full bg-[var(--gold)] px-8 py-3 text-base font-semibold text-white shadow-[0_2px_8px_rgba(184,134,11,0.25)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-deep)] active:scale-[0.97]">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
