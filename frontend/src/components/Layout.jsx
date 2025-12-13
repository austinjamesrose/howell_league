import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold">
                Howell League
              </Link>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Standings
                </Link>
                <Link
                  to="/rosters"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Rosters
                </Link>
                <Link
                  to="/players"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Players
                </Link>
                <Link
                  to="/admin"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
