import React, { useState, useEffect } from "react";
import axios from "axios";
import shape from "../../assets/images/shape.png";
import "./features.css";

const Features = () => {
  // Define state variables
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch feature data from the backend API when the component mounts
    axios
      .get("http://localhost:5000/api/features") // Replace with your backend API URL
      .then((response) => {
        setFeatures(response.data); // Store fetched features data in state
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching features data:", error);
        setLoading(false); // Stop loading even if there was an error
      });
  }, []); // Empty dependency array to fetch data only once

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  return (
    <section className="features section" id="features">
      <h2 className="section__title" data-title="Features">
        Our Best Features
      </h2>
      <div className="features__grid container grid">
        {features.map(({ image_url, title, description }, index) => {
          return (
            <div className="features__item" key={index}>
              <img src={`http://localhost:5000${image_url}`} alt="feature" className="feature__img" />
              <h3 className="feature__title">{title}</h3>
              <p className="feature__description">{description}</p>
              <img src={shape} alt="shape" className="feature__shape" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
