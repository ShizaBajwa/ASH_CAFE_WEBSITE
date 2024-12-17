import React from "react";
import logo from "../../assets/images/logo.png";
import {
  FaRegEnvelope,
  FaCaretRight,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { AiOutlinePhone } from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__grid container grid">
        <div className="footer__content">
          <a href="/" className="footer__logo">
            <img src={logo} alt="ASH Cafe logo" className="footer__logo-img" />
          </a>

          <p className="footer__description">
            ASH Cafe is more than just a coffee brand—it's a celebration of
            craftsmanship, quality, and community. Founded on the belief that
            coffee is an art form, we are dedicated to delivering exceptional
            blends that tell a story in every cup.
          </p>

          
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Quick Links</h3>

          <ul className="footer__links">
            <li>
              <a href="#about" className="footer__link">
                <FaCaretRight className="icon" /> About Us
              </a>
            </li>

            <li>
              <a href="#menu" className="footer__link">
                <FaCaretRight className="icon" /> Menu
              </a>
            </li>

            <li>
              <a href="#features" className="footer__link">
                <FaCaretRight className="icon" /> Features
              </a>
            </li>

            <li>
              <a href="#gallery" className="footer__link">
                <FaCaretRight className="icon" /> Gallery
              </a>
            </li>

            <li>
              <a href="#team" className="footer__link">
                <FaCaretRight className="icon" /> Team
              </a>
            </li>

          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Opening Hours</h3>

          <div className="footer__opening-hour">
            <ul className="opening__hour-list">
              <li className="opening__hour-item">
                <span>Monday:</span>
                <span>09AM-06PM</span>
              </li>

              <li className="opening__hour-item">
                <span>Tuesday:</span>
                <span>09AM-06PM</span>
              </li>

              <li className="opening__hour-item">
                <span>Wednesday:</span>
                <span>09AM-06PM</span>
              </li>

              <li className="opening__hour-item">
                <span>Thursday:</span>
                <span>09AM-06PM</span>
              </li>

              <li className="opening__hour-item">
                <span>Friday:</span>
                <span>09AM-06PM</span>
              </li>

              <li className="opening__hour-item">
                <span>Saturday:</span>
                <span>09AM-05PM</span>
              </li>

            </ul>
          </div>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Contact Us</h3>
          
          <ul className="footer__contact">
            <li className="footer__contact-item">
              <AiOutlinePhone className="icon" /> +123 4567 8901
            </li>

            <li className="footer__contact-item">
              <MdOutlineLocationOn className="icon" /> National Highway, Karachi, Pakistan
            </li>

            <li className="footer__contact-item">
              <FaRegEnvelope className="icon" /> ashcafe@example.com
            </li>
          </ul>

          <div className="footer__socials">
            <h3 className="footer__social-follow">Follow Us:</h3>
            <div className="footer__social-links">
              <a href="/" className="footer__social-link">
                <FaFacebookF />
              </a>

              <a href="/" className="footer__social-link">
                <FaTwitter />
              </a>

              <a href="/" className="footer__social-link">
                <FaLinkedinIn />
              </a>

              <a href="/" className="footer__social-link">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="copyright__text">
        &copy; Copyright 2024 <span>ASH Cafe</span>. All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
