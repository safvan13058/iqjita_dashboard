import React, { useState } from "react";
import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from '../images/logo.png'
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const resetPassword = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
  
    setSending(true);
    try {
      const response = await fetch("https://software.iqjita.com/reset_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },              
        body: JSON.stringify({ email })
      });
  
      const result = await response.json();
  
      if (result.status === "success") {
        alert("Reset link sent! Check your email.");
        setShowForgotPassword(false);
      } else {
        alert(result.error || "Failed to send reset link.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@gmail.com" && password === "admin123") {
        login();
        navigate("/"); // Redirect after successful login
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://software.iqjita.com/authentication.php?action=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data in localStorage
        login(data.user); // Implement login function to update state/context
        navigate("/"); // Redirect after login
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-side"><img src={logo} alt="" /></div>
      <div className="login-section">
        <div className="login-card">

          <h2>LOGIN</h2>
          <form onSubmit={handleLogin}>
            {error && <div className="login-error">{error}</div>}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group password">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="forget" onClick={() => setShowForgotPassword(true)}>
              Forget password?
            </div>

            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      {showForgotPassword && (
        <div className="forgot-modal-overlay">
          <div className="forgot-modal-content">
            <h3>Reset Password</h3>
            <p>Enter your registered email to receive password reset instructions.</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="forgot-modal-buttons">
              <button onClick={resetPassword} disabled={sending}>
                {sending ? "Sending..." : "Send Reset Link"}
              </button>

              <button onClick={() => setShowForgotPassword(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Login;