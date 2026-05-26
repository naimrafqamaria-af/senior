import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import tutoring from "../assets/tutoring.webp";
import babysitting from "../assets/babysitting.webp";
import design from "../assets/graphic.webp";
import delivery from "../assets/delivery.jpeg";
import student from "../assets/student.jpeg";

function PostJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    location: "",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const getJobImage = (category) => {
    const cat = category?.toLowerCase();
    if (cat?.includes("tutor")) return tutoring;
    if (cat?.includes("babysit")) return babysitting;
    if (cat?.includes("design")) return design;
    if (cat?.includes("delivery")) return delivery;
    return student;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const client_id = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/jobs", {
        ...job,
        client_id,
        image: getJobImage(job.category),
      });
      alert("Job Posted Successfully ✅");
      navigate("/jobs");
    } catch (error) {
      console.log(error);
      alert("Failed to post job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-12 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header card */}
        <div className="bg-teal-600 rounded-2xl px-8 py-6 mb-6 shadow-md">
          
          <h1 className="text-white text-3xl font-bold">Post a Job</h1>
          <p className="text-teal-100 text-sm mt-1">Find the right student for your task</p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="p-6 space-y-5">

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Job Title</label>
              <input
                type="text"
                name="title"
                value={job.title}
                onChange={handleChange}
                placeholder="e.g. Math tutor for high school student"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 bg-gray-50 transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                placeholder="Describe the job, schedule, and any requirements…"
                rows="4"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 bg-gray-50 transition resize-none"
                required
              />
            </div>

            {/* Budget + Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={job.budget}
                  onChange={handleChange}
                  placeholder="e.g. $20/hr"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 bg-gray-50 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  value={job.location}
                  onChange={handleChange}
                  placeholder="City or remote"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 bg-gray-50 transition"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
              <select
                name="category"
                value={job.category}
                onChange={handleChange}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-teal-400 bg-gray-50 transition"
                required
              >
                <option value="">Select a category</option>
                <option value="Tutoring">📚 Tutoring</option>
                <option value="Babysitting">🧸 Babysitting</option>
                <option value="Graphic Design">🎨 Graphic Design</option>
                <option value="Delivery">🚚 Delivery</option>
                <option value="Programming">💻 Programming</option>
              </select>
            </div>

            {/* Image preview */}
            {job.category && (
              <div className="relative rounded-xl overflow-hidden h-36">
                <img
                  src={getJobImage(job.category)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-semibold bg-black/30 px-2.5 py-1 rounded-full">
                  {job.category}
                </span>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-sm"
            >
              Post Job →
            </button>
          </div>

        </form>

        <div className="text-center mt-5">
          <Link to="/" className="text-sm text-teal-600 hover:underline">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default PostJob;
