import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return (
      <div style={styles.container}>
        <img className="lostPageImage" src="/images/404Back.svg" alt="check" />
        <p className="lostPagePara" style={styles.text}>The page you are looking for does not exist.</p>
        <Link className="lostPageCTA" to="/" style={styles.link}>
          Back to Home
        </Link>
      </div>
    );
  } else {
    return <div></div>;
  }
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
    color: "#333",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    color: "#666",
  },
  link: {
    fontSize: "1rem",
    color: "#007BFF",
    textDecoration: "none",
  },
};

export default NotFound;
