import React from "react";
import "./home.css";

const Home = () => {
  return (
    <section className="home" id="home">
      <div className="home__container container">
        <div className="home__content">
          <span className="home__subtitle">Welcome to ASH Cafe!</span>
          <h1 className="home__title">
            Experience Exquisite Brews & Inviting Vibes
          </h1>
          <p className="home__description">
            Step into a world where the aroma of freshly brewed coffee mingles
            with the welcoming warmth of a charming café.
          </p>

          <div className="home__btns">
            <a href="#menu" className="btn">
              Check Menu
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
