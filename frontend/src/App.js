import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Authentication from "./components/Authentication/Authentication";
import EditProfile from "./components/Profile/EditProfile/EditProfile";
import Profile from "./components/Profile/Profile";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <nav>
          {!user ? (
            <Link to="/">Home</Link>
          ) : (
            <>
              <Link to="/profile">Profile</Link> | 
              <Link to="/edit-profile">Edit Profile</Link>
            </>
          )}
        </nav>
        <Routes>
          {/* Show Authentication page only if user is not logged in */}
          <Route path="/" element={!user ? <Authentication /> : <Navigate to="/profile" />} />
          
          {/* Protected Routes (Only accessible if logged in) */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
