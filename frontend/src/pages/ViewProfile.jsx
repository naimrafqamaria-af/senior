import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ViewProfile() {

  const { id } = useParams();

  const [user, setUser] = useState(null);

  // =====================================
  // FETCH USER
  // =====================================

  useEffect(() => {

    axios
      .get(`http://localhost:5000/user/${id}`)
      .then((res) => {

        setUser(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  }, [id]);

  // =====================================
  // LOADING
  // =====================================

  if (!user) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-bold">
          Loading...
        </h1>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-10">

        {/* TOP */}
        <div className="flex flex-col items-center mb-10">

          <img
            src={
              user.profile_photo ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-teal-500"
          />

          <h1 className="text-4xl font-bold mt-5">
            {user.name}
          </h1>

          <p className="text-teal-600 font-semibold capitalize mt-2">
            {user.role}
          </p>

        </div>

        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-gray-100 p-5 rounded-xl">

            <h3 className="font-bold mb-2">
              Email
            </h3>

            <p>
              {user.email}
            </p>

          </div>

          <div className="bg-gray-100 p-5 rounded-xl">

            <h3 className="font-bold mb-2">
              Location
            </h3>

            <p>
              {user.location || "Not provided"}
            </p>

          </div>

          <div className="bg-gray-100 p-5 rounded-xl">

            <h3 className="font-bold mb-2">
              Gender
            </h3>

            <p>
              {user.gender || "Not provided"}
            </p>

          </div>

          <div className="bg-gray-100 p-5 rounded-xl">

            <h3 className="font-bold mb-2">
              Phone
            </h3>

            <p>
              {user.phone || "Not provided"}
            </p>

          </div>

        </div>

        {/* STUDENT INFO */}
        {user.role === "student" && (

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-6">
              Student Information
            </h2>

            <div className="space-y-5">

              <div className="bg-gray-100 p-5 rounded-xl">

                <h3 className="font-bold mb-2">
                  University
                </h3>

                <p>
                  {user.university || "Not provided"}
                </p>

              </div>

              <div className="bg-gray-100 p-5 rounded-xl">

                <h3 className="font-bold mb-2">
                  Skills
                </h3>

                <p>
                  {user.skills || "Not provided"}
                </p>

              </div>

              <div className="bg-gray-100 p-5 rounded-xl">

                <h3 className="font-bold mb-2">
                  Past Works
                </h3>

                <p>
                  {user.past_works || "Not provided"}
                </p>

              </div>

            </div>

          </div>

        )}

        {/* CLIENT INFO */}
        {user.role === "client" && (

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-6">
              Client Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-gray-100 p-5 rounded-xl">

                <h3 className="font-bold mb-2">
                  Marital Status
                </h3>

                <p>
                  {user.marital_status || "Not provided"}
                </p>

              </div>

              <div className="bg-gray-100 p-5 rounded-xl">

                <h3 className="font-bold mb-2">
                  Children
                </h3>

                <p>
                  {user.children_count || "0"}
                </p>

              </div>

            </div>

          </div>

        )}

        {/* BACK */}
        <div className="text-center mt-10">

          <Link
            to="/"
            className="text-teal-600 font-semibold hover:underline"
          >
            ← Back Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ViewProfile;