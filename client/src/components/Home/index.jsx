import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>
            The Future of <span>Automotive Retail</span>
          </h1>
          <p>
            Experience AI-Powered Car Photography Solutions for Dealerships &
            Marketplaces.
          </p>
          <Link to="/products" className="cta-button">
            Explore <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
