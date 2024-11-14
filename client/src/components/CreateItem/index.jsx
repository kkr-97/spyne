import React, { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../Spinner";

import "./index.css";

const CreateItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [carType, setCarType] = useState("");
  const [company, setCompany] = useState("");
  const [dealer, setDealer] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = useSelector((state) => state.user.userId);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    // Limit the number of images to a maximum of 10
    if (files.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }

    if (!files) return;

    try {
      files.map(async (item) => {
        const data = new FormData();
        data.append("file", item);
        data.append("upload_preset", "spyne_assignment");
        data.append("cloud_name", "da9xcuzgg");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/da9xcuzgg/image/upload",
          data
        );
        console.log(res);
        setImages((prevImages) => [...prevImages, res.data.url]);
      });
    } catch (error) {
      console.error("Error converting images to Base64:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookie.get("token"); // Assuming you're storing JWT token in localStorage
      await axios.post(
        "http://localhost:3001/create-item",
        {
          title,
          description,
          tags,
          carType,
          company,
          dealer,
          images,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Car item created successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error creating car item:", error);
      alert("Failed to create car item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col create-item-container">
          <h2>Create New Car Item</h2>
          <form onSubmit={handleSubmit} className="create-item-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <input
              type="text"
              placeholder="Car Type"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
            />
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              type="text"
              placeholder="Dealer"
              value={dealer}
              onChange={(e) => setDealer(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {loading ? (
              <Spinner />
            ) : (
              <button type="submit">Create Car Item</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
