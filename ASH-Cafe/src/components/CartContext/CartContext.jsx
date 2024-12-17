// CartContext.js
import React, { createContext, useState, useContext } from "react";

// Create the CartContext
const CartContext = createContext();

// CartProvider component that wraps around your app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Add item to the cart
  const addItemToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
    setTotal((prevTotal) => prevTotal + item.price);
  };

  // Remove item from the cart
  const removeItemFromCart = (item_id) => {
    const updatedItems = cartItems.filter((item) => item.item_id !== item_id);
    setCartItems(updatedItems);
    setTotal(updatedItems.reduce((acc, item) => acc + item.price, 0));
  };

  return (
    <CartContext.Provider value={{ cartItems, total, addItemToCart, removeItemFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);
