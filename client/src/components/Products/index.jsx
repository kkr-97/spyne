import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Cookie from "js-cookie";

import Spinner from "../Spinner";
import "./index.css";

const ProductList = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filters, setFilters] = useState({
    carType: "",
    company: "",
    dealer: "",
  });

  const userId = useSelector((state) => state.user.userId);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []); // Re-fetch cars when search query or filters change

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://spyne-1kdl.onrender.com/user-cars",
        {
          params: { userId: userId, search: search, ...filters },
          headers: {
            "auth-token": Cookie.get("token"),
          },
        }
      );
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleViewCar = (carId) => {
    navigate(`/product/${carId}`);
  };

  const toggleFilterPopup = () => {
    setShowFilterPopup(!showFilterPopup);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setShowFilterPopup(false);
    fetchCars();
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <h2>Your Cars</h2>

          <div className="d-flex align-items-center">
            <input
              type="search"
              placeholder="Search your cars..."
              value={search}
              onChange={handleSearchChange}
              className="search-bar"
            />
            <button
              className="btn btn-secondary mx-2"
              onClick={toggleFilterPopup}
            >
              Filters <i className="fa-solid fa-filter"></i>
            </button>
            <Link className="btn btn-primary" to="/create-item">
              Add <i className="fa-solid fa-plus"></i>
            </Link>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className="car-list">
              {cars.length > 0 ? (
                cars.map((car) => (
                  <div
                    key={car._id}
                    className="car-item"
                    onClick={() => handleViewCar(car._id)}
                  >
                    <h3>{car.title}</h3>
                    <p>{car.description}</p>
                    <p>
                      <strong>Company:</strong> {car.company}
                    </p>
                    <p>
                      <strong>Tags:</strong> {car.tags.join(", ")}
                    </p>
                    <div className="car-images-prod">
                      {car.images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Car Image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No cars found</p>
              )}
            </div>
          )}

          {/* Filter Popup */}
          {showFilterPopup && (
            <div className="filter-popup">
              <h4>Apply Filters</h4>
              <div className="filter-inputs">
                <input
                  type="text"
                  name="carType"
                  placeholder="Car Type"
                  value={filters.carType}
                  onChange={handleFilterChange}
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={filters.company}
                  onChange={handleFilterChange}
                />
                <input
                  type="text"
                  name="dealer"
                  placeholder="Dealer"
                  value={filters.dealer}
                  onChange={handleFilterChange}
                />
              </div>
              <button className="btn btn-primary" onClick={applyFilters}>
                Apply Filters
              </button>
              <button className="btn btn-secondary" onClick={toggleFilterPopup}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
