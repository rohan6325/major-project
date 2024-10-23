// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Overview from './pages/Overview.jsx';
import Sidemenu from './components/sidebar.jsx';
import VoterListPage from './pages/voterlist.jsx';
import CandidatePage from './pages/candidatelist.jsx';
import ConductPage from './pages/conduct.jsx';
import VotecastPage from './pages/votecast.jsx';
import PrivateRoute from './PrivateRoute.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with actual authentication logic

  return (
    <BrowserRouter>
      <div className="flex">
        <Sidemenu />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Overview /> : <Navigate to="/candidate" />
              }
            />
            <Route path="/candidate" element={<CandidatePage />} />
            <Route path="/votecast" element={<VotecastPage />} />
            <Route
              path="/voter"
              element={
                <PrivateRoute
                  element={VoterListPage}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
            <Route
              path="/conduct"
              element={
                <PrivateRoute
                  element={ConductPage}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;