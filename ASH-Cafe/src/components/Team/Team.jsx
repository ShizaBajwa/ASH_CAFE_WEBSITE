import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import "./team.css";

const Team = () => {
  // Define state variables
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend API when the component mounts
    axios
      .get("http://localhost:5000/api/chefs") // Replace with your backend API URL
      .then((response) => {
        setChefs(response.data); // Store fetched chefs data in state
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching chef data:", error);
        setLoading(false); // Stop loading even if there was an error
      });
  }, []); // Empty dependency array to fetch data only once

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  const baseUrl = "http://localhost:5000"; // Base URL for images

  return (
    <section className="team section" id="team">
      <h2 className="section__title" data-title="Chefs">
        Meet Our Experts
      </h2>

      <div className="team__grid grid container">
        {chefs.map(({ chef_id, name, specialty, bio, image_url }) => {
          // Handle image URL fallback if it's missing
          const imageSrc = image_url ? `${baseUrl}${image_url}` : "default-image.jpg"; // Replace with default image URL

          return (
            <div className="team__item" key={chef_id}>
              <img src={imageSrc} alt={name} className="team__img" />
              <div className="team__data">
                <h3 className="team__name">{name}</h3>
                <p className="team__job">{specialty}</p>
                <p className="team__bio">{bio}</p>
              </div>

              <div className="team__socials">
                <a href="/" className="team__social-link">
                  <FaFacebookF />
                </a>
                <a href="/" className="team__social-link">
                  <FaTwitter />
                </a>
                <a href="/" className="team__social-link">
                  <FaLinkedinIn />
                </a>
                <a href="/" className="team__social-link">
                  <FaYoutube />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Team;
