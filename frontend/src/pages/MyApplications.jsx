import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem("userId");

    if (!studentId) {
      setLoading(false);
      return;
    }

    // =========================
    // APPLIED JOBS
    // =========================
    axios
      .get(`http://localhost:5000/my-applications/${studentId}`)
      .then((res) => {
        setApplications(res.data);
      })
      .catch((err) => console.log(err));

    // =========================
    // SAVED JOBS
    // =========================
    axios
      .get(`http://localhost:5000/saved-jobs/${studentId}`)
      .then((res) => {
        setSavedJobs(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Accepted") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading jobs…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">

      {/* HEADER */}
      <div className="bg-teal-600 py-10 text-center">
        <h1 className="text-3xl font-bold text-white">
          My Jobs
        </h1>
        <p className="text-teal-100 text-sm mt-1">
          Applied & Saved Jobs
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* =========================
            APPLIED JOBS
        ========================= */}
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Applied Jobs ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <p className="text-gray-400 mb-8">
            No applied jobs yet
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

            {applications.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow p-5"
              >
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full h-40 object-cover rounded-xl"
                />

                <h3 className="font-bold mt-3">{job.title}</h3>

                <p className="text-sm text-gray-500">
                  📍 {job.location}
                </p>
                 
                 <div className="mt-3">

  <span
    className={`
      px-3 py-1 rounded-full text-xs font-semibold

      ${job.status === "Accepted"
        ? "bg-green-100 text-green-700"

        : job.status === "Rejected"
        ? "bg-red-100 text-red-700"

        : "bg-yellow-100 text-yellow-700"}
    `}
  >
    {job.status || "Pending"}
  </span>

</div>
                <p className="text-sm text-orange-500 font-bold">
                  ${job.budget}
                </p>

               
              </div>
            ))}
          </div>
        )}

        {/* =========================
            SAVED JOBS
        ========================= */}
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Saved Jobs ({savedJobs.length})
        </h2>

        {savedJobs.length === 0 ? (
          <p className="text-gray-400">
            No saved jobs yet
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow p-5"
              >
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full h-40 object-cover rounded-xl"
                />

                <h3 className="font-bold mt-3">{job.title}</h3>

                <p className="text-sm text-gray-500">
                  📍 {job.location}
                </p>

                <p className="text-sm text-orange-500 font-bold">
                  ${job.budget}
                </p>

                <Link
                  to="/jobs"
                  className="inline-block mt-3 text-teal-600 text-sm font-semibold"
                >
                  View More →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* BACK */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="text-teal-600 font-semibold"
          >
            ← Back Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default MyApplications;