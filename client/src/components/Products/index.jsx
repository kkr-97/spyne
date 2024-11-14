import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./index.css";

const ProductList = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user.userId); // Get userId from redux state
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, [search]); // Re-fetch cars when search query changes

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/user-cars", {
        params: { userId: userId, search: search },
      });
      setCars(response.data); // Update state with fetched cars
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update search state
  };

  const handleViewCar = (carId) => {
    navigate(`/product/${carId}`); // Navigate to the detailed page of the selected car
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Your Cars</h2>

          <input
            type="text"
            placeholder="Search your cars..."
            value={search}
            onChange={handleSearchChange}
            className="search-bar"
          />

          {loading ? (
            <p>Loading cars...</p>
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
                    <div className="car-images">
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
        </div>
      </div>
    </div>
  );
};

export default ProductList;
