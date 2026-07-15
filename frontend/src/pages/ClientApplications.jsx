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

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:5000/accept-application/${id}`);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "Accepted" } : app))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/reject-application/${id}`);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "Rejected" } : app))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Accepted") return "bg-green-100 text-green-700 border border-green-200";
    if (status === "Rejected") return "bg-red-100 text-red-600 border border-red-200";
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg animate-pulse">Loading applications…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-teal-600 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Client Applications</h1>
            <p className="text-teal-200 text-sm mt-1">
              Review and respond to student applications
            </p>
          </div>
          <Link to="/my-posted-jobs">
            <button className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-teal-50 transition">
              My Posted Jobs
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* STATS BAR */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{applications.length}</span>
          {applications.length === 1 ? "application" : "applications"} received
        </div>

        {/* EMPTY STATE */}
        {applications.length === 0 ? (
          <div className="text-center py-24 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg font-medium text-gray-500">No applications yet</p>
            <p className="text-sm mt-1">Applications from students will appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition"
              >

                {/* NAME + STATUS */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-gray-800">{app.student_name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{app.student_email}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                {/* DIVIDER */}
                <hr className="border-gray-100" />

                {/* JOB */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Applied for</p>
                  <p className="font-semibold text-teal-700 text-sm">{app.job_title}</p>
                </div>

                {/* MESSAGE */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {app.message}
                </p>

                {/* BUTTONS */}
                <div className="flex gap-2 mt-auto pt-2">
                  <Link to={`/profile/${app.student_id}`} className="flex-1">
                    <button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded-lg text-sm font-medium transition">
                      👤 Profile
                    </button>
                  </Link>
                  <button
  onClick={() => handleAccept(app.id)}
 
  className={`flex-1 py-2 rounded-lg text-sm font-medium transition text-white ${
    app.status !== "Pending"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600"
  }`}
>
  ✓ Accept
</button>

<button
  onClick={() => handleReject(app.id)}
 
  className={`flex-1 py-2 rounded-lg text-sm font-medium transition text-white ${
    app.status !== "Pending"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-red-400 hover:bg-red-500"
  }`}
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
          <Link to="/" className="text-teal-600 hover:text-teal-700 font-medium text-sm transition">
            ← Back Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ClientApplications;