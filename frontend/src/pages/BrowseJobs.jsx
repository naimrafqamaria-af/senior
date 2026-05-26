import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

import tutoring from "../assets/tutoring.webp";
import babysitting from "../assets/babysitting.webp";
import design from "../assets/graphic.webp";
import delivery from "../assets/delivery.jpeg";
import student from "../assets/student.jpeg";

function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [categorySearch, setCategorySearch] = useState(searchQuery);
  const [locationSearch, setLocationSearch] = useState("");

  // =========================
  // GET IMAGE
  // =========================
  const getJobImage = (category) => {
    const cat = category?.toLowerCase();
    if (cat?.includes("tutor") || cat?.includes("teaching")) return tutoring;
    if (cat?.includes("babysit") || cat?.includes("child")) return babysitting;
    if (cat?.includes("design") || cat?.includes("graphic")) return design;
    if (cat?.includes("delivery") || cat?.includes("driver")) return delivery;
    return student;
  };

  // =========================
  // APPLY JOB (FIXED + INSTANT UI UPDATE)
  // =========================
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

      // ✅ INSTANT UPDATE (no refresh needed)
      setAppliedJobs((prev) => [...prev, jobId]);

      
    } catch (error) {
      console.log(error);
      alert("Failed to apply");
    }
  };

  // =========================
  // SAVE JOB
  // =========================
  const handleSave = async (jobId) => {
    try {
      await axios.post("http://localhost:5000/save-job", {
        student_id: localStorage.getItem("userId"),
        job_id: jobId,
      });

      alert("Job saved ✅");
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // GET JOBS
  // =========================
  useEffect(() => {
    axios
      .get("http://localhost:5000/jobs")
      .then((res) => {
        setJobs(res.data);
        setFilteredJobs(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // =========================
  // GET APPLIED JOBS (FIX A)
  // =========================
  useEffect(() => {
    const studentId = localStorage.getItem("userId");

    if (!studentId) return;

    axios
      .get(`http://localhost:5000/my-applications/${studentId}`)
      .then((res) => {
        // ✅ FIX: use job_id not app.id
        const ids = res.data.map((app) => app.job_id);
        setAppliedJobs(ids);
      })
      .catch((err) => console.log(err));
  }, []);

  // =========================
  // FILTER JOBS
  // =========================
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

      <div className="bg-teal-600 py-10 px-6 text-center">
        <h1 className="text-3xl font-bold text-white">Browse Jobs</h1>
        <p className="text-teal-100 text-sm mt-1">
          Find the perfect job that fits your skills
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* SEARCH */}
        <div className="grid md:grid-cols-2 gap-3 mb-10">
          <input
            type="text"
            placeholder="Search category..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Search location..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="border rounded-xl p-3"
          />
        </div>

        {/* JOBS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow p-4">

              <img
                src={getJobImage(job.category)}
                className="h-40 w-full object-cover rounded-lg"
                alt={job.title}
              />

              <h2 className="font-bold mt-2">{job.title}</h2>
              <p className="text-sm text-gray-500">{job.location}</p>

              <p className="text-orange-500 font-bold">${job.budget}</p>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-3">

                <button
                  onClick={() => handleApply(job.id)}
                  disabled={appliedJobs.includes(job.id)}
                  className={`w-full py-2 rounded-lg ${
                    appliedJobs.includes(job.id)
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-teal-600 text-white"
                  }`}
                >
                  {appliedJobs.includes(job.id)
                    ? "Applied"
                    : "Apply Now"}
                </button>

                <button
                  onClick={() => handleSave(job.id)}
                  className="px-3 border rounded-lg"
                >
                  🔖
                </button>

              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/" className="text-teal-600">
            ← Back Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default BrowseJobs;