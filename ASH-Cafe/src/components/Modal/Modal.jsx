import React, { useState } from "react";
import axios from "axios";
import "./modal.css";

function Modal({ closeModal, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");

  // Toggle between Login and Register forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", password: "" }); // Reset form fields
    setError(""); // Clear any errors
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine the correct URL for login or register
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const baseUrl = 'http://localhost:5000'

    try {
      // Send request to the backend
      const response = await axios.post(baseUrl + url, formData);
      alert(response.data.message); // Show success message

      if (isLogin) {
        // On login, save the token to localStorage
        localStorage.setItem("token", response.data.token);
        onLoginSuccess(); // Notify parent component about login success
      }
      
      closeModal(); // Close the modal on success
    } catch (error) {
      // Handle errors (e.g., display error message from the backend)
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={closeModal}>X</button>
        {isLogin ? (
          <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  placeholder="Username" 
                  required 
                />
              </div>              
              <div>
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Password" 
                  required 
                />
              </div>
              <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Don't have an account? <a onClick={toggleForm}>Register</a></p>
          </div>
        ) : (
          <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  placeholder="Username" 
                  required 
                />
              </div>
              <div>
                <label>Email</label>
                <input 
                  type="text" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Email" 
                  required 
                />
              </div>
              <div>
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Password" 
                  required 
                />
              </div>
              <button type="submit">Register</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Already have an account? <a onClick={toggleForm}>Login</a></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
