import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

import tutoring from "../assets/tutoring.webp";
import babysitting from "../assets/babysitting.webp";
import design from "../assets/graphic.webp";
import delivery from "../assets/delivery.jpeg";
import work from "../assets/work.webp";

const CATEGORY_EMOJIS = {
  tutoring: "📚",
  teaching: "📚",
  babysit: "🧸",
  child: "🧸",
  design: "🎨",
  graphic: "🎨",
  delivery: "🚚",
  driver: "🚚",
  waitress: "🍽️",
  skiing: "⛷️",
  cleaning: "🧹",
  gardening: "🌿",
  photography: "📷",
  moving: "📦",
  tech: "💻",
};

const getCategoryEmoji = (category) => {
  const cat = category?.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (cat?.includes(key)) return emoji;
  }
  return "✳️";
};

const getJobImage = (category) => {
  const cat = category?.toLowerCase();
  if (cat?.includes("tutor") || cat?.includes("teaching")) return tutoring;
  if (cat?.includes("babysit") || cat?.includes("child")) return babysitting;
  if (cat?.includes("design") || cat?.includes("graphic")) return design;
  if (cat?.includes("delivery") || cat?.includes("driver")) return delivery;
  return work;
};

function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [categorySearch, setCategorySearch] = useState(searchQuery);
  const [locationSearch, setLocationSearch] = useState("");

  const handleApply = async (jobId) => {
    try {
      const student_id = localStorage.getItem("userId");

      if (localStorage.getItem("role") !== "student") {
        alert("Only students can apply");
        return;
      }

      await axios.post("http://localhost:5000/apply", {
        student_id,
        job_id: jobId,
        message: "I am interested in this job",
      });

      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (error) {
      console.log(error);
      alert("Failed to apply");
    }
  };

  const handleSave = async (jobId) => {
    try {
      await axios.post("http://localhost:5000/save-job", {
        student_id: localStorage.getItem("userId"),
        job_id: jobId,
      });
      setSavedJobs((prev) => [...prev, jobId]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/jobs")
      .then((res) => {
        setJobs(res.data);
        setFilteredJobs(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const studentId = localStorage.getItem("userId");
    if (!studentId) return;

    axios
      .get(`http://localhost:5000/my-applications/${studentId}`)
      .then((res) => {
        const ids = res.data.map((app) => app.job_id);
        setAppliedJobs(ids);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const matchCategory = job.category
        .toLowerCase()
        .includes(categorySearch.toLowerCase());
      const matchLocation = job.location
        .toLowerCase()
        .includes(locationSearch.toLowerCase());
      return matchCategory && matchLocation;
    });
    setFilteredJobs(filtered);
  }, [categorySearch, locationSearch, jobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">

      {/* HERO */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-500 py-14 px-6 text-center">

        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-1">Browse Jobs</h1>
        <p className="text-teal-100 text-sm mb-8">
          Find the perfect job that fits your skills
        </p>

        {/* SEARCH BAR */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1 px-3">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              placeholder="Category (e.g. Tutoring, Design...)"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full py-2 text-sm text-gray-700 focus:outline-none"
            />
          </div>
          <div className="w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2 flex-1 px-3">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder="Location..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full py-2 text-sm text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* RESULTS COUNT */}
        <p className="text-sm text-gray-500 mb-6">
          Showing{" "}
          <span className="font-semibold text-gray-700">{filteredJobs.length}</span>{" "}
          job{filteredJobs.length !== 1 ? "s" : ""}
          {categorySearch && (
            <> for <span className="font-semibold text-teal-600">"{categorySearch}"</span></>
          )}
        </p>

        {/* EMPTY STATE */}
        {filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No jobs found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters</p>
          </div>
        )}

        {/* JOB GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.includes(job.id);
            const isSaved = savedJobs.includes(job.id);

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 group"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden h-44 bg-gray-50">
                  <img
                    src={getJobImage(job.category)}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={job.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Category badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <span>{getCategoryEmoji(job.category)}</span>
                    {job.category}
                  </span>

                  {/* Save button */}
                  <button
                    onClick={() => handleSave(job.id)}
                    title={isSaved ? "Saved" : "Save job"}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all
                      ${isSaved
                        ? "bg-teal-600 text-white"
                        : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-teal-600"
                      }`}
                  >
                    <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h2 className="font-bold text-gray-800 text-base leading-snug mb-3">
                    {job.title}
                  </h2>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="text-emerald-600 font-bold">${job.budget}</span>
                  </div>

                  {/* APPLY BUTTON */}
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={isApplied}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95
                      ${isApplied
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow-md"
                      }`}
                  >
                    {isApplied ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Applied
                      </span>
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BACK HOME */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default BrowseJobs;