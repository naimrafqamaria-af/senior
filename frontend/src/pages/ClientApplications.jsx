import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ClientApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientId = localStorage.getItem("userId");

    axios
      .get(`http://localhost:5000/client-applications/${clientId}`)
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // =========================
  // ACCEPT
  // =========================
  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:5000/accept-application/${id}`);
      alert("Application Accepted");

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "Accepted" } : app
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // REJECT
  // =========================
  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/reject-application/${id}`);
      alert("Application Rejected");

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "Rejected" } : app
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    if (status === "Accepted") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading applications…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">

      {/* HEADER */}
      <div className="bg-teal-600 py-10 px-6 text-center">
        <h1 className="text-3xl font-bold text-white">
          Client Applications
        </h1>
        <p className="text-teal-100 text-sm mt-1">
          Review and respond to student applications
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* EMPTY STATE */}
        {applications.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-lg font-medium">
              No applications yet
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3"
              >

                {/* NAME + STATUS */}
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold">
                      {app.student_name}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {app.student_email}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* JOB */}
                <div>
                  <p className="text-xs text-gray-400">Job</p>
                  <p className="font-semibold text-teal-700">
                    {app.job_title}
                  </p>
                </div>

                {/* MESSAGE */}
                <p className="text-sm text-gray-500">
                  {app.message}
                </p>

                {/* BUTTONS */}
                <div className="flex gap-2 mt-2">

                  {/* PROFILE */}
                  <Link
                    to={`/profile/${app.student_id}`}
                    className="flex-1"
                  >
                    <button className="w-full bg-blue-500 text-white py-2 rounded-xl">
                      👤 Profile
                    </button>
                  </Link>

                  {/* ACCEPT */}
                  <button
                    onClick={() => handleAccept(app.id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl"
                  >
                    ✓ Accept
                  </button>

                  {/* REJECT */}
                  <button
                    onClick={() => handleReject(app.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl"
                  >
                    ✕ Reject
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

        {/* BACK */}
        <div className="text-center mt-12">
          <Link to="/" className="text-teal-600 font-semibold">
            ← Back Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ClientApplications;