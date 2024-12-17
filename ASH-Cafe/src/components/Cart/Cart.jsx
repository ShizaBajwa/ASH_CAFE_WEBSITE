import React, { useState } from "react";
import { useCart } from "../CartContext/CartContext"; // Import the context hook
import axios from "axios"; // Import axios for sending requests
import "./cart.css";

function Cart({ closeCart }) {
  const { cartItems, total, removeItemFromCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert("You need to login to checkout.");
      return; // If the user is not logged in, show an alert
    }

    // Send the order to the backend
    const orderData = {
      phone,
      address,
      cartItems,
      user_id: localStorage.getItem("user_id"), // Assuming you store the user ID in localStorage after login
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/checkout",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setIsCheckoutSuccess(true);
      }
      setError("");
      // localStorage.getItem("token")
    } catch (err) {
      setError("Error placing order.");
    }
  };

  return (
    <div className="cart-overlay">
      <div className="cart-content">
        <button className="close-btn" onClick={closeCart}>X</button>
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <div>
            <ul className="cart-items">
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <span>{item.name}</span> ${item.price}
                  <button onClick={() => removeItemFromCart(item.item_id)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <p>Total: ${Number(total).toFixed(2)}</p>
            </div>
          </div>
        )}

        {isLoggedIn ? (
          <div>
            <label>Enter Delivery Details</label>
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <br /><br />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <br /><br />
            {error && <p className="error">{error}</p>}
            <button onClick={handleCheckout}>Place Order</button>
            {isCheckoutSuccess && <p>Order placed successfully!</p>}
          </div>
        ) : (
          <button onClick={() => alert("You need to login to checkout.")}>Login to Checkout</button>
        )}
      </div>
    </div>
  );
}

export default Cart;
