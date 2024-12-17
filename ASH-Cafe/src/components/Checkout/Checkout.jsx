import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./checkout.css";

const Checkout = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle form submission (login or register)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      setError("Please provide both email and password.");
      return;
    }

    const endpoint = isRegistering ? "/api/register" : "/api/login";

    axios
      .post(endpoint, user)
      .then((response) => {
        // Save user data to localStorage or state after successful login/registration
        localStorage.setItem("user", JSON.stringify(response.data));
        history.push("/order-confirmation"); // Redirect to order confirmation page
      })
      .catch((error) => {
        setError(error.response?.data?.message || "An error occurred.");
      });
  };

  return (
    <div className="checkout">
      <h2>{isRegistering ? "Register" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>

      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="toggle-auth-btn"
      >
        {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
      </button>
    </div>
  );
};

export default Checkout;
