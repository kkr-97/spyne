// src/components/UpdateCar.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";

import "./index.css";

const UpdateCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carDetails, setCarDetails] = useState({
    title: "",
    description: "",
    tags: "",
    carType: "",
    company: "",
    dealer: "",
  });

  const [images, setImages] = useState([]);

  // Fetch existing car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(
          `https://spyne-1kdl.onrender.com/cars/${id}`,
          {
            headers: {
              "auth-token": Cookie.get("token"),
            },
          }
        );
        const { title, description, tags, carType, company, dealer, images } =
          response.data;
        setCarDetails({
          title,
          description,
          tags: tags.join(", "), // Convert array to comma-separated string for input
          carType,
          company,
          dealer,
        });
        setImages(images);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails({ ...carDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCar = {
        ...carDetails,
        tags: carDetails.tags.split(",").map((tag) => tag.trim()), // Convert string to array
      };

      const response = await axios.put(
        `https://spyne-1kdl.onrender.com/products/${id}`,
        updatedCar,
        {
          headers: {
            "auth-token": Cookie.get("token"),
          },
        }
      );
      alert("Car details updated successfully!");
      navigate(`/product/${id}`); // Navigate back to the car detail page
    } catch (error) {
      console.error("Error updating car details:", error);
      alert("Failed to update car details. Please try again.");
    }
  };

  return (
    <div className="update-car-page">
      <h2>Update Car Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={carDetails.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={carDetails.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tags (comma-separated):</label>
          <input
            type="text"
            name="tags"
            value={carDetails.tags}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Car Type:</label>
          <input
            type="text"
            name="carType"
            value={carDetails.carType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Company:</label>
          <input
            type="text"
            name="company"
            value={carDetails.company}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Dealer:</label>
          <input
            type="text"
            name="dealer"
            value={carDetails.dealer}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="update-button">
          Update
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate(`/product/${id}`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateCar;
