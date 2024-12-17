import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsPlusLg } from "react-icons/bs";
import "./gallery.css";

const Gallery = () => {
  // Define state variables
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch gallery data from the backend API when the component mounts
    axios
      .get("http://localhost:5000/api/gallery") // Replace with your backend API URL
      .then((response) => {
        setGallery(response.data); // Store fetched gallery data in state
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching gallery data:", error);
        setLoading(false); // Stop loading even if there was an error
      });
  }, []); // Empty dependency array to fetch data only once

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  return (
    <section className="gallery section" id="gallery">
      <h2 className="section__title" data-title="Gallery">
        Our Photo Gallery
      </h2>

      <div className="gallery__grid container grid">
        {gallery.map(({ image_url, description }, index) => {
          return (
            <div className="gallery__item" key={index}>
              <img src={`http://localhost:5000${image_url}`} alt={description} className="gallery__img" />
              <a href="/" className="gallery__icon">
                <BsPlusLg />
              </a>
              <h3 className="gallery__title">{description}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Gallery;
