// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Overview from './pages/Overview.jsx';
import Sidemenu from './components/sidebar.jsx';
import VoterListPage from './pages/voterlist.jsx';
import CandidatePage from './pages/candidatelist.jsx';
import ConductPage from './pages/conduct.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidemenu />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/voter" element={<VoterListPage />} />
            <Route path="/candidate" element={<CandidatePage />} />
            <Route path="/conduct" element={<ConductPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;