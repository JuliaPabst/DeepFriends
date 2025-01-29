import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Authentication from "./components/Authentication/Authentication";
import EditProfile from "./components/Profile/EditProfile/EditProfile";
import Profile from "./components/Profile/Profile";
import HomeChat from "./components/Chat/HomeChat/HomeChat";


const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <nav>
        {!user ? (
          <div></div>
        ) : (
          <>
            <Link to="/">Chat</Link> | 
            <Link to="/profile">Profile</Link> | 
            <Link to="/edit-profile">Edit Profile</Link> | 
            <button onClick={logout} style={{ marginLeft: "10px", cursor: "pointer" }}>Logout</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={user ? <HomeChat /> : <Authentication />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;