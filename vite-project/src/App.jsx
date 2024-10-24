// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Overview from "./pages/Overview.jsx";
import Sidemenu from "./components/sidebar.jsx";
import VoterListPage from "./pages/voterlist.jsx";
import CandidatePage from "./pages/candidatelist.jsx";
import ConductPage from "./pages/conduct.jsx";
import VotecastPage from "./pages/votecast.jsx";
import ProtectedRoute from "./PrivateRoute.jsx";
import SuccPage from "./pages/success.jsx";
import SignIn from "./pages/authentication.jsx";
import supabase from "./utils/supabase.js";

function App() {
  // Replace with actual authentication logic
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: "", // 'admin' or 'voter'
  });

  useEffect(() => {
    // Check for an existing session on page load
    const session = supabase.auth.session();

    if (session) {
      // Check if the user is an admin or voter
      setAuth({
        isAuthenticated: true,
        role: session.user?.role || "voter", // Assume 'voter' if no role is defined
      });
    }

    // Listen to changes in the authentication state (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Assume role logic is implemented in your database
          // You can also fetch the user's role if it's stored separately
          const userRole = session.user.role || "voter";
          setAuth({
            isAuthenticated: true,
            role: userRole,
          });
        } else if (event === "SIGNED_OUT") {
          setAuth({
            isAuthenticated: false,
            role: null,
          });
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

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
      {/* If not authenticated, redirect to SignInPage */}
      {!auth.isAuthenticated ? (
        <Routes>
          <Route path="/signin" element={<SignIn setAuth={setAuth} />} />
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      ) : (
        <div className="flex">
          {/* Show Sidemenu if the user is authenticated */}
          <Sidemenu userRole={auth.role} />
          <main className="flex-1">
            <Routes>
              {/* Redirect to default route based on user role */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={routeConfig[auth.role]?.defaultRoute || "/signin"}
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
      )}
    </BrowserRouter>
  );
}

export default App;
