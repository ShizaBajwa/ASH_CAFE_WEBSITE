// App.jsx
import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Features from "./components/Features/Features";
import Menu from "./components/Menu/Menu";
import Choose from "./components/Choose/Choose";
import Gallery from "./components/Gallery/Gallery";
import Offer from "./components/Offer/Offer";
import Team from "./components/Team/Team";
import Footer from "./components/Footer/Footer";
import { CartProvider } from "./components/CartContext/CartContext"; // Import CartProvider

import "./index.css";

function App() {
  return (
    <CartProvider>
      <Header />
      <Home />
      <About />
      <Choose />
      <Menu />
      <Gallery />
      <Offer />
      <Team />
      <Features />
      <Footer />
    </CartProvider>
  );
}

export default App;
