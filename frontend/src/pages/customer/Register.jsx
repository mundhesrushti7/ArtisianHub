import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(
      localStorage.getItem("artisanHubUsers") || "[]"
    );

    const userExists = existingUsers.some(
      (user) => user.email === formData.email
    );

    if (userExists) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    existingUsers.push(newUser);

    localStorage.setItem(
      "artisanHubUsers",
      JSON.stringify(existingUsers)
    );

    alert("Account created successfully!");

    navigate("/login");
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <p>JOIN ARTISANHUB</p>

          <h1>Create Account</h1>

          <span>
            Create an account and discover unique handmade products.
          </span>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <label>
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>
            Account Type
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="customer">
              Customer
            </option>

            <option value="artisan">
              Artisan
            </option>
          </select>

          <label>
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />

          <label>
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="auth-button"
          >
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?

          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;