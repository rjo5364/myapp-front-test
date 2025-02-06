import React from "react";

const Login = () => {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>Please log in using one of the following:</p>
        <div style={styles.buttonContainer}>
          <a
            href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
            style={{ ...styles.button, ...styles.google }}
          >
            <img 
              src="/google-icon.png" 
              alt="Google" 
              style={styles.icon}
            />
            Login with Google
          </a>
          <a
            href={`${process.env.REACT_APP_BACKEND_URL}/auth/github`}
            style={{ ...styles.button, ...styles.github }}
          >
            <img 
              src="/github-icon.png" 
              alt="GitHub" 
              style={styles.icon}
            />
            Login with GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f9",
    padding: "1rem",
  },
  box: {
    textAlign: "center",
    padding: "2.5rem",
    border: "1px solid #e1e1e1",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "0.5rem",
    fontWeight: "600",
  },
  subtitle: {
    color: "#666",
    marginBottom: "1.5rem",
    fontSize: "1rem",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  button: {
    textDecoration: "none",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    border: "none",
    cursor: "pointer",
  },
  google: {
    backgroundColor: "#db4437",
    "&:hover": {
      backgroundColor: "#c53929",
      transform: "translateY(-1px)",
    },
  },
  github: {
    backgroundColor: "#24292e",
    "&:hover": {
      backgroundColor: "#1a1e22",
      transform: "translateY(-1px)",
    },
  },
  icon: {
    width: "20px",
    height: "20px",
    marginRight: "10px",
  },
};

export default Login;