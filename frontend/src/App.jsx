import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rosters from './pages/Rosters';
import PlayerStandings from './pages/PlayerStandings';
import QBDetails from './pages/QBDetails';
import Admin from './pages/Admin';
import AllTimeMoney from './pages/AllTimeMoney';
import LeagueRules from './pages/LeagueRules';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rosters" element={<Rosters />} />
          <Route path="players" element={<PlayerStandings />} />
          <Route path="qb/:qbId" element={<QBDetails />} />
          <Route path="admin" element={<Admin />} />
          <Route path="all-time" element={<AllTimeMoney />} />
          <Route path="rules" element={<LeagueRules />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
