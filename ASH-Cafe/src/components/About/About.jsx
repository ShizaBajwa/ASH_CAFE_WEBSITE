import React from "react";
import aboutImg from "../../assets/images/about-img.jpg";
import { FiCheck } from "react-icons/fi";
import "./about.css";

const About = () => {
  return (
    <section className="about section" id="about">
      <div className="about__grid container grid">
        <div className="about__img-wrapper">
          <img src={aboutImg} alt="" className="about__img" />
        </div>

        <div className="about__content">
          <h2 className="section__title title-left" data-title="About Us">
            Discover ASH Cafe: Where Coffee Meets Community
          </h2>
          <p className="about__description">
            At ASH Cafe, we invite you to embark on a journey of taste and
            connection. Our mission is to provide more than just exceptional
            coffee; we aim to create a welcoming space where individuals can
            come together, share stories, and build lasting relationships.
          </p>

          <div className="about__details grid">
            <p className="about__details-description">
              <FiCheck />
              Exceptional Coffee
            </p>
            <p className="about__details-description">
              <FiCheck />
              Welcoming Atmosphere
            </p>
            <p className="about__details-description">
              <FiCheck />
              Community Engagement
            </p>
          </div>

          <a href="#team" className="btn">
            Our Experts
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
