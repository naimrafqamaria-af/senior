import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import tutoring from "../assets/tutoring.webp";
import babysitting from "../assets/babysitting.webp";
import design from "../assets/graphic.webp";
import delivery from "../assets/delivery.jpeg";
import work from "../assets/work.webp";

const CATEGORIES = [
  { value: "Tutoring",       emoji: "📚", label: "Tutoring",        description: "Academic support & lessons" },
  { value: "Babysitting",    emoji: "🧸", label: "Babysitting",      description: "Childcare & supervision" },
  { value: "Graphic Design", emoji: "🎨", label: "Graphic Design",   description: "Logos, branding & visuals" },
  { value: "Delivery",       emoji: "🚚", label: "Delivery",         description: "Parcels, food & errands" },
  { value: "Waitressing",    emoji: "🍽️", label: "Waitressing",      description: "Events, restaurants & catering" },
  { value: "Skiing", emoji: "⛷️", label: "Skiing", description: "Ski instruction & mountain guiding" },
  { value: "Cleaning",       emoji: "🧹", label: "Cleaning",         description: "Home, office & deep clean" },
  { value: "Gardening",      emoji: "🌿", label: "Gardening",        description: "Lawn care & landscaping" },
  { value: "Photography",    emoji: "📷", label: "Photography",      description: "Events, portraits & editing" },
  { value: "Moving Help",    emoji: "📦", label: "Moving Help",      description: "Packing, lifting & transport" },
  { value: "Tech Support",   emoji: "💻", label: "Tech Support",     description: "Repairs, setup & IT help" },
  { value: "Others",         emoji: "✳️", label: "Others",           description: "Something not listed above" },
];

const getJobImage = (category) => {
  const cat = category?.toLowerCase();
  if (cat?.includes("tutor")) return tutoring;
  if (cat?.includes("babysit")) return babysitting;
  if (cat?.includes("design")) return design;
  if (cat?.includes("delivery")) return delivery;
  return work;
};

function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  const handleCategorySelect = (value) => {
    setJob({ ...job, category: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      alert("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = CATEGORIES.find((c) => c.value === job.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back link */}
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl px-8 py-8 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Post a Job</h1>
              <p className="text-teal-100 text-sm mt-0.5">Find the right student for your task</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-7 space-y-6">

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Job Title
              </label>
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
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Description
              </label>
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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    type="text"
                    name="budget"
                    value={job.budget}
                    onChange={handleChange}
                    placeholder="20/hr"
                    className="w-full border-2 border-gray-100 rounded-xl pl-7 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 bg-gray-50 transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    name="location"
                    value={job.location}
                    onChange={handleChange}
                    placeholder="City or remote"
                    className="w-full border-2 border-gray-100 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 bg-gray-50 transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = job.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleCategorySelect(cat.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all cursor-pointer
                        ${isSelected
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-100 bg-gray-50 hover:border-teal-200 hover:bg-white"
                        }`}
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className={`text-xs font-semibold leading-tight ${isSelected ? "text-teal-700" : "text-gray-600"}`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Hidden required field trick */}
              <input
                type="text"
                name="category"
                value={job.category}
                onChange={() => {}}
                required
                className="sr-only"
                tabIndex={-1}
              />
            </div>

            {/* Image Preview */}
            {job.category && (
              <div className="relative rounded-xl overflow-hidden h-40 shadow-sm">
                <img
                  src={getJobImage(job.category)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-lg">{selectedCategory?.emoji}</span>
                  <span className="text-white text-sm font-semibold">{selectedCategory?.label}</span>
                  <span className="text-white/70 text-xs">— {selectedCategory?.description}</span>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-7 pb-7">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Post Job →"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default PostJob;