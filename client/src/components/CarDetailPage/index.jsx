import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";

import "./index.css";
import Spinner from "../Spinner";

const CarImages = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="car-images">
      <div className="image-gallery">
        <img src={images[currentImage]} alt="Car" />
      </div>
      <div className="carousel-controls">
        <button onClick={handlePrev}>←</button>
        <button onClick={handleNext}>→</button>
      </div>
    </div>
  );
};

const CarInfo = ({ carDetails }) => {
  const { description, tags, carType, company, dealer } = carDetails;

  return (
    <div className="car-info">
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>Car Type:</strong> {carType}
      </p>
      <p>
        <strong>Company:</strong> {company}
      </p>
      <p>
        <strong>Dealer:</strong> {dealer}
      </p>
      <div className="tags">
        <strong>Tags:</strong>
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const CarDetailPage = () => {
  const { id } = useParams();
  const [carDetails, setCarDetails] = useState(null);

  const navigate = useNavigate();

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
        setCarDetails(response.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://spyne-1kdl.onrender.com/products/${id}`, {
        headers: {
          "auth-token": Cookie.get("token"),
        },
      });
      navigate("/products");
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleUpdate = () => {
    navigate(`/update-car/${id}`);
  };

  const handleBack = () => {
    navigate("/products");
  };

  if (!carDetails) {
    return <Spinner />;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <button onClick={handleBack} className="btn btn-secondary">
            <i class="fa-solid fa-left-long"></i> Back
          </button>
        </div>

        <div className="col-12 car-detail-page">
          <h1>{carDetails.title}</h1>
          <CarImages images={carDetails.images} />
          <CarInfo carDetails={carDetails} />
          <div className="d-flex align-items-center justify-content-center">
            <button onClick={handleUpdate} className="btn btn-warning me-2">
              Update
            </button>

            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
