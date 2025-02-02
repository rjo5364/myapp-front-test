import React from "react";

const Login = () => {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1>Welcome</h1>
        <p>Please log in using one of the following:</p>
        <div style={styles.buttonContainer}>
          <a
            href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
            style={{ ...styles.button, ...styles.google }}
          >
            Login with Google
          </a>
          <a
            href={`${process.env.REACT_APP_BACKEND_URL}/auth/linkedin`}
            style={{ ...styles.button, ...styles.linkedin }}
          >
            Login with LinkedIn
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
    height: "100vh",
    backgroundColor: "#f4f4f9",
  },
  box: {
    textAlign: "center",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "90%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
  },
  button: {
    textDecoration: "none",
    color: "white",
    padding: "12px 20px",
    borderRadius: "4px",
    display: "inline-block",
    fontWeight: "500",
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: 0.9,
    },
  },
  google: {
    backgroundColor: "#db4437",
  },
  linkedin: {
    backgroundColor: "#0077b5",
  },
};

export default Login;