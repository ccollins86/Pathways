import { useState, useCallback, FormEvent } from "react";

interface AuthScreenProps {
  onAuthenticated: (user: { id: number; username: string }) => void;
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");

      if (!username.trim() || !password) {
        setError("Please fill in all fields");
        return;
      }

      if (mode === "register" && password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);
      try {
        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Something went wrong");
          return;
        }

        onAuthenticated(data);
      } catch {
        setError("Connection failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [mode, username, password, confirmPassword, onAuthenticated]
  );

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setConfirmPassword("");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #0a1628 0%, #1a2a4a 40%, #0d1f3c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(148, 163, 184, 0.15)",
          borderRadius: 16,
          padding: "40px 36px",
          width: 380,
          maxWidth: "90vw",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 80px rgba(59, 130, 246, 0.08)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#f1f5f9",
              marginBottom: 6,
              letterSpacing: -0.5,
            }}
          >
            Disaster Prep Quest
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8", fontWeight: 400 }}>
            {mode === "login" ? "Sign in to continue your adventure" : "Create an account to get started"}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#94a3b8",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(30, 41, 59, 0.8)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: 8,
                color: "#f1f5f9",
                fontSize: 15,
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(59, 130, 246, 0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(148, 163, 184, 0.2)")}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#94a3b8",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(30, 41, 59, 0.8)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: 8,
                color: "#f1f5f9",
                fontSize: 15,
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(59, 130, 246, 0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(148, 163, 184, 0.2)")}
            />
          </div>

          {mode === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: 8,
                  color: "#f1f5f9",
                  fontSize: 15,
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(59, 130, 246, 0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(148, 163, 184, 0.2)")}
              />
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                color: "#fca5a5",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px 0",
              background: loading ? "rgba(59, 130, 246, 0.4)" : "linear-gradient(135deg, #3b82f6, #2563eb)",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: 0.3,
              transition: "opacity 0.2s",
              marginBottom: 16,
            }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#64748b", fontSize: 14 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <span
            onClick={switchMode}
            style={{
              color: "#60a5fa",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
}
