import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle Inputs
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Login
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );

      // Save Full User
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Save Role
      localStorage.setItem(
        "role",
        response.data.user.role
      );

      // Save Name
      localStorage.setItem(
        "userName",
        response.data.user.name
      );

      // Save User ID
      localStorage.setItem(
        "userId",
        response.data.user.id
      );

     

      // Redirect Home
      navigate("/");

      // Refresh Page
      window.location.reload();

    } catch (err) {

      console.log(err);

      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-[400px]"
      >

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6"
          onChange={handleChange}
          required
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;