import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  // =====================================
  // STATES
  // =====================================

  const [jobs, setJobs] = useState([]);

  const [users, setUsers] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);

  const [totalApplications, setTotalApplications] =
    useState(0);

  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH DATA
  // =====================================

  useEffect(() => {

    fetchJobs();

    fetchUsers();

    fetchApplications();

    fetchUsersList();

  }, []);

  // =====================================
  // FETCH JOBS
  // =====================================

  const fetchJobs = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/jobs"
      );

      setJobs(res.data);

      setLoading(false);

    } catch (err) {

      console.log(err);

      setLoading(false);

    }

  };

  // =====================================
  // FETCH TOTAL USERS
  // =====================================

  const fetchUsers = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/total-users"
      );

      setTotalUsers(res.data.total);

    } catch (err) {

      console.log(err);

    }

  };

  // =====================================
  // FETCH APPLICATIONS COUNT
  // =====================================

  const fetchApplications = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/total-applications"
      );

      setTotalApplications(res.data.total);

    } catch (err) {

      console.log(err);

    }

  };

  // =====================================
  // FETCH USERS LIST
  // =====================================

  const fetchUsersList = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/users"
      );

      setUsers(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  // =====================================
  // DELETE JOB
  // =====================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {

      return;

    }

    try {

      await axios.delete(
 ` http://localhost:5000/jobs/${id}`,
  {
    headers: {
      role: localStorage.getItem("role"),
    },
  }
);

      setJobs(
        jobs.filter((job) => job.id !== id)
      );

      alert("Job deleted successfully ✅");

    } catch (err) {

      console.log(err);

      alert("Failed to delete job");

    }

  };

  // =====================================
  // DELETE USER
  // =====================================

  const handleDeleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) {

      return;

    }

    try {

      await axios.delete(
        `http://localhost:5000/users/${id}`
      );

      setUsers(
        users.filter((user) => user.id !== id)
      );

      alert("User deleted successfully ✅");

    } catch (err) {

      console.log(err);

      alert("Failed to delete user");

    }

  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="text-center text-2xl p-10">
        Loading...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-10 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-teal-600">
          Admin Dashboard
        </h1>

        <Link
          to="/"
          className="text-gray-600 hover:text-teal-600"
        >
          Back Home
        </Link>

      </nav>

      {/* Dashboard */}
      <div className="p-10">

        <h2 className="text-3xl font-bold mb-8">
          Platform Overview
        </h2>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* Jobs */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">

            <h3 className="text-gray-500 mb-2">
              Total Jobs
            </h3>

            <p className="text-4xl font-bold text-teal-600">
              {jobs.length}
            </p>

          </div>

          {/* Users */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">

            <h3 className="text-gray-500 mb-2">
              Registered Users
            </h3>

            <p className="text-4xl font-bold text-orange-500">
              {totalUsers}
            </p>

          </div>

          {/* Applications */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">

            <h3 className="text-gray-500 mb-2">
              Applications
            </h3>

            <p className="text-4xl font-bold text-blue-500">
              {totalApplications}
            </p>

          </div>

        </div>

        {/* RECENT JOBS */}
        <div className="bg-white p-8 rounded-2xl shadow">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              Recent Posted Jobs
            </h2>

            <span className="text-gray-500">
              {jobs.length} Jobs
            </span>

          </div>

          {jobs.length === 0 ? (

            <p className="text-gray-500">
              No jobs posted yet.
            </p>

          ) : (

            <div className="space-y-5">

              {jobs.map((job) => (

                <div
                  key={job.id}
                  className="border rounded-xl p-5 flex justify-between items-center hover:shadow-md transition"
                >

                  <div>

                    <h3 className="font-bold text-lg">
                      {job.title}
                    </h3>

                    <p className="text-gray-500">
                      {job.category}
                    </p>

                    <p className="text-gray-500 text-sm">
                      📍 {job.location}
                    </p>

                    <p className="text-teal-600 font-semibold mt-2">
                      ${job.budget}
                    </p>

                  </div>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* USERS SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow mt-10">

          <h2 className="text-2xl font-bold mb-6">
            Registered Users
          </h2>

          {users.length === 0 ? (

            <p className="text-gray-500">
              No users found.
            </p>

          ) : (

            <div className="space-y-4">

              {users.map((user) => (

                <div
                  key={user.id}
                  className="border rounded-xl p-5 flex justify-between items-center hover:shadow-md transition"
                >

                  <div>

                    <h3 className="font-bold text-lg">
                      {user.name}
                    </h3>

                    <p className="text-gray-500">
                      {user.email}
                    </p>

                    <p className="text-sm text-teal-600 font-semibold">
                      {user.role}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      handleDeleteUser(user.id)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}

export default AdminDashboard;