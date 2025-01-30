import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Authentication from "./components/Authentication/Authentication";
import EditProfile from "./components/Profile/EditProfile/EditProfile";
import Profile from "./components/Profile/Profile";
import HomeChat from "./components/Chat/HomeChat/HomeChat";
import Matches from "./components/Matches/Matches";
import ChatPage from "./components/Chat/ChatPage";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleLogout = async () => {
    await logout();
    setRedirectToHome(true);
  };

  return (
    <Router>
      {redirectToHome && <Navigate to="/" replace />}

      <div className="app-container">
        {user && (
          <button className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
          </button>
        )}

        <nav className={`sidebar ${menuOpen ? "open" : ""}`}>
          {user && (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>Chat</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <Link to="/matches" onClick={() => setMenuOpen(false)}>Matches</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          )}
        </nav>

        {/* 🔹 Main Content */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={user ? <HomeChat /> : <Authentication />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/chat/:matchId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
    </Router>
  );
}

export default App;
