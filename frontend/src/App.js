import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Authentication from "./components/Authentication/Authentication";

function App() {
  return (
    <AuthProvider>
      <div>
        <h1>Deep Friends</h1>
        <Authentication />
      </div>
    </AuthProvider>
  );
}

export default App;
