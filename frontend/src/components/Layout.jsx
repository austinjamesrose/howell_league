import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-gold text-lg">▰▰▰</span>
              <div>
                <span className="font-oswald text-xl font-bold text-white tracking-wide">
                  HOWELL LEAGUE
                </span>
                <span className="hidden sm:inline text-text-muted text-xs ml-3">
                  2025 Season
                </span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    tab-underline px-4 py-2 font-inter text-sm font-medium transition-colors
                    ${isActive(link.to)
                      ? 'text-gold active'
                      : 'text-text-secondary hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Hamburger button for mobile */}
            <button
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-white hover:bg-dark-elevated focus:outline-none focus:ring-2 focus:ring-gold"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
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
            <div className="md:hidden pb-4 border-t border-border-subtle mt-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    block px-4 py-3 rounded-md font-inter text-base font-medium transition-colors
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
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-muted text-sm font-mono">
            Howell League • Est. 2021
          </p>
        </div>
      </footer>
    </div>
  );
}
