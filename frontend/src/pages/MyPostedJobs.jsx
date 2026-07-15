import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyPostedJobs() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {

    const clientId = localStorage.getItem("userId");

    axios
      .get(`http://localhost:5000/client-jobs/${clientId}`)
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // =========================
  // DELETE JOB
  // =========================
  const handleDelete = async (id) => {

    try {

      await axios.delete(`http://localhost:5000/jobs/${id}`, {
        data: {
          userId: localStorage.getItem("userId"),
          role: localStorage.getItem("role"),
        },
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));

    } catch (err) {

      console.log(err);
      alert(err.response?.data?.message || "Delete failed");

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 p-10">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
        My Posted Jobs
      </h1>

      {/* EMPTY */}
      {jobs.length === 0 ? (

        <p className="text-center text-gray-500">No jobs posted yet</p>

      ) : (

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => (

            <div
              key={job.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative bg-gray-100">
                <img
                  src={job.image}
                  alt={job.title}
                  className="h-44 w-full object-contain"
                />
                <span className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                  {job.category || "Job"}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-4">

                <h2 className="font-bold text-gray-800 text-base">{job.title}</h2>

                <p className="text-sm text-gray-500 mt-1">📍 {job.location}</p>

                <p className="text-orange-500 font-bold mt-1">${job.budget}</p>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition"
                >
                  Delete Job
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* BACK */}
      <div className="text-center mt-10">
        <Link to="/" className="text-teal-600 font-semibold hover:underline">
          ← Back Home
        </Link>
      </div>

    </div>

  );

}

export default MyPostedJobs;