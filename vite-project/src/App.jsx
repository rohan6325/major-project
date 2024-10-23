// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Overview from "./pages/Overview.jsx";
import Sidemenu from "./components/sidebar.jsx";
import VoterListPage from "./pages/voterlist.jsx";
import CandidatePage from "./pages/candidatelist.jsx";
import ConductPage from "./pages/conduct.jsx";
import VotecastPage from "./pages/votecast.jsx";
import ProtectedRoute from "./PrivateRoute.jsx";
import SuccPage from "./pages/success.jsx";

function App() {
  // Replace with actual authentication logic
  const [auth, setAuth] = useState({
    isAuthenticated: true,
    role: "voter", // 'admin' or 'voter'
  });

  // Define route access configurations
  const routeConfig = {
    admin: {
      allowedRoutes: ["/overview", "/voter", "/conduct", "/candidate"],
      defaultRoute: "/overview",
    },
    voter: {
      allowedRoutes: ["/votecast", "/success"],
      defaultRoute: "/votecast",
    },
  };

  return (
    <BrowserRouter>
      <div className="flex">
        <Sidemenu userRole={auth.role} />
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    auth.isAuthenticated
                      ? routeConfig[auth.role].defaultRoute
                      : "/candidate"
                  }
                />
              }
            />
            <Route
              path="/candidate"
              element={
                <ProtectedRoute
                  element={CandidatePage}
                  isAuthenticated={auth.isAuthenticated}
                  requiredRole="admin"
                  userRole={auth.role}
                />
              }
            />

            {/* Admin routes */}
            <Route
              path="/overview"
              element={
                <ProtectedRoute
                  element={Overview}
                  isAuthenticated={auth.isAuthenticated}
                  requiredRole="admin"
                  userRole={auth.role}
                />
              }
            />
            <Route
              path="/voter"
              element={
                <ProtectedRoute
                  element={VoterListPage}
                  isAuthenticated={auth.isAuthenticated}
                  requiredRole="admin"
                  userRole={auth.role}
                />
              }
            />
            <Route
              path="/conduct"
              element={
                <ProtectedRoute
                  element={ConductPage}
                  isAuthenticated={auth.isAuthenticated}
                  requiredRole="admin"
                  userRole={auth.role}
                />
              }
            />

            {/* Voter routes */}
            <Route
              path="/votecast"
              element={
                <ProtectedRoute
                  element={VotecastPage}
                  isAuthenticated={auth.isAuthenticated}
                  requiredRole="voter"
                  userRole={auth.role}
                />
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute
                  element={SuccPage}
                  isAuthenticated={auth.isAuthenticated}
                  requiredRole="voter"
                  userRole={auth.role}
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
