import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [photo, setPhoto] = useState(user.profile_photo || "");
  const [file, setFile] = useState(null);

  const [location, setLocation] = useState(user.location || "");
  const [gender, setGender] = useState(user.gender || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [university, setUniversity] = useState(user.university || "");
  const [skills, setSkills] = useState(user.skills || "");
  const [pastWorks, setPastWorks] = useState(user.past_works || "");
  const [maritalStatus, setMaritalStatus] = useState(user.marital_status || "");
  const [childrenCount, setChildrenCount] = useState(user.children_count || "");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  if (!user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-600">
          Please login first
        </h1>
      </div>
    );
  }

  // =========================
  // UPLOAD IMAGE
  // =========================
  const handleUpload = async () => {
    if (!file) return photo;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      return res.data.imageUrl;
    } catch (err) {
      console.log(err);
      alert("Image upload failed");
      return photo;
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdate = async () => {
    try {
      const uploadedPhoto = await handleUpload();

      await axios.put(`http://localhost:5000/users/${user.id}`, {
        name,
        email,
        profile_photo: uploadedPhoto,
        location,
        gender,
        phone,
        university,
        skills,
        past_works: pastWorks,
        marital_status: maritalStatus,
        children_count: childrenCount,
      });

      const updatedUser = {
        ...user,
        name,
        email,
        profile_photo: uploadedPhoto,
        location,
        gender,
        phone,
        university,
        skills,
        past_works: pastWorks,
        marital_status: maritalStatus,
        children_count: childrenCount,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("userName", name);

      setPhoto(uploadedPhoto);

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }
  };

  // =========================
  // PASSWORD CHANGE
  // =========================
  const handlePassword = async () => {
    try {
      await axios.put(`http://localhost:5000/change-password/${user.id}`, {
        password,
      });

      alert("Password changed successfully ✅");
      setPassword("");
    } catch (err) {
      console.log(err);
      alert("Failed to change password");
    }
  };

  const inputClass = `w-full border-2 rounded-xl px-4 py-3 text-sm transition ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-gray-50 border-gray-100 text-gray-800"
  }`;

  const labelClass = `block text-xs font-bold uppercase mb-1.5 text-gray-400`;

  const sectionClass = `rounded-2xl border p-6 ${
    darkMode
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-100 shadow-sm"
  }`;

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-teal-50 to-gray-100"
      }`}
    >
      {/* HEADER */}
      <div className="bg-teal-600 py-10 px-6 text-center relative">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 px-3 py-2 rounded-xl text-white"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* PROFILE PHOTO */}
        <div className={`${sectionClass} flex flex-col items-center gap-4`}>

          <label className="cursor-pointer">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : photo ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-teal-400"
            />

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <p className="text-xs text-gray-400">
            Click image to upload new photo
          </p>
        </div>

        {/* BASIC INFO */}
        <div className={sectionClass}>
          <h2 className="text-sm font-bold mb-4 text-gray-500">
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />

            <input
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <input
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
            />

            <input
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />

            <select
              className={inputClass}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

          </div>
        </div>

        {/* STUDENT INFO */}
        {user.role === "student" && (
          <div className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-gray-500">
              Student Info
            </h2>

            <textarea
              className={inputClass}
              rows="3"
              placeholder="Skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <textarea
              className={`${inputClass} mt-3`}
              rows="3"
              placeholder="Past Works"
              value={pastWorks}
              onChange={(e) => setPastWorks(e.target.value)}
            />

            <input
              className={`${inputClass} mt-3`}
              placeholder="University"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={handleUpdate}
          className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold"
        >
          Save Profile
        </button>

        {/* PASSWORD */}
        <div className={sectionClass}>
          <h2 className="text-sm font-bold mb-4 text-gray-500">
            Security
          </h2>

          <input
            type="password"
            className={inputClass}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handlePassword}
            className="w-full mt-3 bg-orange-500 text-white py-3 rounded-xl"
          >
            Change Password
          </button>
        </div>

        {/* BACK */}
        <div className="text-center">
          <Link to="/" className="text-teal-600 font-semibold">
            ← Back Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Profile;