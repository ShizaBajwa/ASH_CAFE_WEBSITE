// Menu.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../CartContext/CartContext"; // Import the context hook
import "./menu.css";

const Menu = () => {
  const { addItemToCart } = useCart(); // Access the addItemToCart function from context
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend API when the component mounts
    axios
      .get("http://localhost:5000/api/menu") // Replace with your backend API URL
      .then((response) => {
        setMenuItems(response.data); // Store fetched menu data in state
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching menu data:", error);
        setLoading(false); // Stop loading even if there was an error
      });
  }, []);

  const handleAddToCart = (item) => {
    const itemWithValidPrice = { ...item, price: parseFloat(item.price) }; // Ensure price is a number
    addItemToCart(itemWithValidPrice); // Use the addItemToCart function from context
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  return (
    <section className="menu section" id="menu">
      <h2 className="section__title" data-title="Our Menu">
        Let's Check Our Menu
      </h2>

      <div className="menu__grid container grid">
        {menuItems.map(({ item_id, image_url, name, description, price }) => (
          <div className="menu__item grid" key={item_id}>
            <div className="menu__img-wrapper">
              <img
                src={`http://localhost:5000${image_url}`}
                alt={name}
                className="menu__img"
              />
            </div>
            <div className="menu__data">
              <div>
                <h3 className="menu__title">{name}</h3>
                <p className="menu__description">{description}</p>
              </div>
              <span className="menu__price">${price}</span>
              <button
                className="menu__btn"
                onClick={() => handleAddToCart({ item_id, name, price })}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
