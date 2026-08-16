import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSeason } from '../context/SeasonContext';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { season, setSeason, seasons } = useSeason();

  const navLinks = [
    { to: '/', label: 'Standings' },
    { to: '/rosters', label: 'Rosters' },
    { to: '/players', label: 'Players' },
    { to: '/all-time', label: 'All-Time $' },
    { to: '/rules', label: 'Rules' },
    { to: '/admin', label: 'Admin' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <nav className="bg-dark-surface border-b border-border-subtle bg-noise sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 min-w-0">
              <span className="text-gold text-lg shrink-0">▰▰▰</span>
              <div className="min-w-0">
                <span className="font-oswald text-lg sm:text-xl font-bold text-white tracking-wide whitespace-nowrap">
                  AR15 LEAGUE
                </span>
                <span className="hidden lg:inline text-text-muted text-xs ml-3">
                  {season} Season
                </span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center space-x-0.5 lg:space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    tab-underline px-2 lg:px-4 py-2 font-inter text-xs lg:text-sm font-medium
                    whitespace-nowrap transition-colors
                    ${isActive(link.to)
                      ? 'text-gold active'
                      : 'text-text-secondary hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}

              {/* Season switcher */}
              <label className="ml-1 lg:ml-3 flex items-center gap-2">
                <span className="sr-only">Season</span>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="bg-dark-elevated border border-border-subtle text-gold font-oswald font-semibold uppercase tracking-wide text-xs lg:text-sm rounded-md px-2 lg:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
                  aria-label="Select season"
                >
                  {seasons.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Hamburger button for mobile */}
            <button
              className="sm:hidden p-2 -mr-2 rounded-md text-text-secondary hover:text-white hover:bg-dark-elevated focus:outline-none focus:ring-2 focus:ring-gold"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-4 border-t border-border-subtle mt-2 pt-4">
              {/* Season switcher */}
              <div className="px-2 pb-3 mb-2 border-b border-border-subtle">
                <label className="flex items-center justify-between">
                  <span className="font-oswald text-sm font-medium uppercase tracking-wide text-text-secondary">
                    Season
                  </span>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="bg-dark-elevated border border-border-subtle text-gold font-oswald font-semibold uppercase tracking-wide text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold"
                    aria-label="Select season"
                  >
                    {seasons.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    block px-2 py-3 rounded-md font-inter text-base font-medium transition-colors
                    ${isActive(link.to)
                      ? 'text-gold bg-dark-elevated'
                      : 'text-text-secondary hover:text-white hover:bg-dark-elevated'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-6 mt-auto">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="text-text-muted text-sm font-mono">
            AR15 League • Est. 2021
          </p>
        </div>
      </footer>
    </div>
  );
}
