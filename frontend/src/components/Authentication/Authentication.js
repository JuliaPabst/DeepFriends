import React, { useState } from "react";
import SignUp from "./SignUp/SignUp";
import Login from "./LogIn/LogIn";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to Deep Friends</h1>
      <p>Connect deeply with like-minded people!</p>

      {isLogin ? <Login /> : <SignUp />}

      <p>
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => setIsLogin(false)}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign up here!
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setIsLogin(true)}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Log in here!
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default Authentication;
