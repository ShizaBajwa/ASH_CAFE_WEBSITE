import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-scroll";
import { animateScroll } from "react-scroll";
import { FaStream } from "react-icons/fa";
import Modal from "../Modal/Modal"; // Import the Modal component
import Cart from "../Cart/Cart"; // Import the Cart component
import Menu from "../Menu/Menu"; // Import the Menu component
import { FaShoppingCart } from "react-icons/fa"; // Import shopping cart icon
import "./header.css";

const links = [
  {
    name: "Home",
    path: "home",
  },
  {
    name: "About",
    path: "about",
  },
  {
    name: "Menu",
    path: "menu",
  },
  {
    name: "Gallery",
    path: "gallery",
  },
  {
    name: "Chefs",
    path: "team",
  },
  {
    name: "Features",
    path: "features",
  },
  {
    name: "Login",
    path: "login", // This is the link for login, but it will open a modal instead of scrolling
  },
];

const Header = () => {
  const [scrollHeader, setScrollHeader] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [isCartOpen, setIsCartOpen] = useState(false); // State for the cart modal
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [cartItems, setCartItems] = useState([]); // State for the cart

  const changeHeader = () => {
    if (window.scrollY >= 80) {
      setScrollHeader(true);
    } else {
      setScrollHeader(false);
    }
  };

  const scrollTop = () => {
    animateScroll.scrollToTop();
  };

  const openModal = () => {
    setIsModalOpen(true); // Open login modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close login modal
  };

  const handleLogout = () => {
    // clear token
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]); // Add item to cart
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen); // Toggle cart modal visibility
  };

  useEffect(() => {
    window.addEventListener("scroll", changeHeader);
  }, []);

  return (
    <header className={`${scrollHeader ? "scroll-header" : ""} header`}>
      <nav className="nav container">
        <Link to="/" onClick={scrollTop} className="nav__logo">
          <img src={logo} alt="ash cafe logo" className="nav__logo-img" />
        </Link>

        <div className={`${showMenu ? "show-menu" : ""} nav__menu`}>
          <ul className="nav__list">
            {links.map(({ name, path }, index) => {
              return (
                <li className="nav__item" key={index}>
                  {name === "Login" ? (
                    // For the Login link, trigger the modal instead of scrolling
                    !isLoggedIn ? (
                      <p className="nav__link auth" onClick={openModal}>
                        {name}
                      </p>
                    ) : (
                      <p className="nav__link auth" onClick={handleLogout}>
                        Logout
                      </p>
                    )
                  ) : (
                    <Link
                      to={path}
                      spy={true}
                      smooth={true}
                      offset={-60}
                      hashSpy={true}
                      duration={500}
                      className="nav__link"
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      {name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav__toggle" onClick={() => setShowMenu(!showMenu)}>
          <FaStream />
        </div>

        {/* Cart icon with item count */}
        <div className="nav__cart" onClick={toggleCart}>
          <FaShoppingCart className="nav__cart-icon" />
          {cartItems.length > 0 && (
            <span className="cart__count">{cartItems.length}</span>
          )}
        </div>
      </nav>

      {/* Cart Modal */}
      {isCartOpen && (
        <Cart closeCart={() => setIsCartOpen(false)} cartItems={cartItems} />
      )}

      {/* Login Modal */}
      {isModalOpen && <Modal closeModal={closeModal} />}
    </header>
  );
};

export default Header;
