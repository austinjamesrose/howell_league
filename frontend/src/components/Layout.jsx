import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Standings' },
    { to: '/rosters', label: 'Rosters' },
    { to: '/players', label: 'Players' },
    { to: '/all-time', label: 'All-Time $' },
    { to: '/rules', label: 'Rules' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold">
              Howell League
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Hamburger button for mobile */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
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
            <div className="md:hidden pb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
