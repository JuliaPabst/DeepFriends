import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Authentication from "./components/Authentication/Authentication";
import EditProfile from "./components/Profile/EditProfile/EditProfile";
import Profile from "./components/Profile/Profile";
import HomeChat from "./components/Chat/HomeChat/HomeChat";
import Matches from "./components/Matches/Matches";
import ChatPage from "./components/Chat/ChatPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  const { user, logout } = useAuth();
  const [redirectToHome, setRedirectToHome] = useState(false); // 🔥 Track logout redirect

  const handleLogout = async () => {
    await logout();
    setRedirectToHome(true); // 🔥 Trigger redirect
  };

  return (
    <Router>
      {redirectToHome && <Navigate to="/" replace />} {/* 🔥 Redirect to home after logout */}

      <nav>
        {!user ? (
          <div></div>
        ) : (
          <>
            <Link to="/">Chat</Link> | 
            <Link to="/profile">Profile</Link> | 
            <Link to="/edit-profile">Edit Profile</Link> | 
            <Link to="/matches">Matches</Link> |
            <button onClick={handleLogout} style={{ marginLeft: "10px", cursor: "pointer" }}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={user ? <HomeChat /> : <Authentication />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat/:matchId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
