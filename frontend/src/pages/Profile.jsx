import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const loggedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const isOwnProfile = !id || Number(id) === loggedUser.id;

  useEffect(() => {
    const userId = id || loggedUser.id;
    axios
      .get(`http://localhost:5000/user/${userId}`)
      .then((res) => { setUser(res.data); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [skills, setSkills] = useState("");
  const [pastWorks, setPastWorks] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoto(user.profile_photo || "");
      setLocation(user.location || "");
      setGender(user.gender || "");
      setPhone(user.phone || "");
      setUniversity(user.university || "");
      setSkills(user.skills || "");
      setPastWorks(user.past_works || "");
      setMaritalStatus(user.marital_status || "");
      setChildrenCount(user.children_count || "");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-teal-700 font-semibold text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100 gap-4">
        <div className="text-6xl">😕</div>
        <h1 className="text-2xl font-bold text-gray-700">User not found</h1>
        <Link to="/" className="text-teal-600 underline font-medium">← Back Home</Link>
      </div>
    );
  }

  const handleUpload = async () => {
    if (!file) return photo;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      return res.data.imageUrl;
    } catch (err) {
      console.log(err);
      return photo;
    }
  };

  const showFeedback = (msg, isError = false) => {
    if (isError) setErrorMsg(msg);
    else setSuccessMsg(msg);
    setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 3000);
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const uploadedPhoto = await handleUpload();
      await axios.put(`http://localhost:5000/users/${user.id}`, {
        name, email, profile_photo: uploadedPhoto,
        location, gender, phone, university, skills,
        past_works: pastWorks, marital_status: maritalStatus, children_count: childrenCount,
      });
      showFeedback("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      showFeedback("Failed to update profile.", true);
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async () => {
    if (!password.trim()) return showFeedback("Please enter a new password.", true);
    setChangingPassword(true);
    try {
      await axios.put(`http://localhost:5000/change-password/${user.id}`, { password });
      showFeedback("Password changed successfully!");
      setPassword("");
    } catch (err) {
      console.log(err);
      showFeedback("Failed to change password.", true);
    } finally {
      setChangingPassword(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition placeholder-gray-400 text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed";

  const labelClass = "block text-sm font-medium text-gray-500 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-100">

      {/* HERO HEADER */}
      <div className="relative bg-gradient-to-r from-teal-600 to-teal-500 pb-24 pt-10 text-center shadow-md">
        <Link to="/" className="absolute left-6 top-6 text-white/80 hover:text-white text-sm font-medium flex items-center gap-1 transition">
          ← Back Home
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {isOwnProfile ? "My Profile" : `${user.name}'s Profile`}
        </h1>
        <p className="text-teal-100 mt-1 text-sm capitalize">{user.role}</p>
      </div>

      {/* TOAST NOTIFICATIONS */}
      {(successMsg || errorMsg) && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${successMsg ? "bg-teal-500" : "bg-red-500"}`}>
          {successMsg || errorMsg}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 -mt-16 pb-16 space-y-5">

        {/* AVATAR CARD */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center gap-3 border border-gray-100">
          <label className={`relative group ${isOwnProfile ? "cursor-pointer" : ""}`}>
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-teal-400 shadow"
            />
            {isOwnProfile && (
              <>
                <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              </>
            )}
          </label>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-gray-400 text-sm">{email}</p>
          </div>
          {isOwnProfile && (
            <span className="text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Click photo to change
            </span>
          )}
        </div>

        {/* BASIC INFO */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input className={inputClass} value={name} disabled={!isOwnProfile} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} value={email} disabled={!isOwnProfile} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input className={inputClass} value={location} disabled={!isOwnProfile} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={phone} disabled={!isOwnProfile} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Gender</label>
              {isOwnProfile ? (
                <select className={inputClass} value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              ) : (
                <input className={inputClass} value={gender} disabled placeholder="Gender" />
              )}
            </div>
          </div>
        </div>

        {/* STUDENT INFO */}
        {user.role === "student" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">
              Student Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>University</label>
                <input className={inputClass} value={university} disabled={!isOwnProfile} onChange={(e) => setUniversity(e.target.value)} placeholder="University name" />
              </div>
              <div>
                <label className={labelClass}>Skills</label>
                <textarea className={inputClass} rows="3" value={skills} disabled={!isOwnProfile} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React, Node.js, Design..." />
              </div>
              <div>
                <label className={labelClass}>Past Works</label>
                <textarea className={inputClass} rows="3" value={pastWorks} disabled={!isOwnProfile} onChange={(e) => setPastWorks(e.target.value)} placeholder="Describe your previous projects..." />
              </div>
            </div>
          </div>
        )}

        {/* CLIENT INFO */}
        {user.role === "client" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">
              Client Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Marital Status</label>
                {isOwnProfile ? (
                  <select className={inputClass} value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                ) : (
                  <input className={inputClass} value={maritalStatus} disabled placeholder="Marital Status" />
                )}
              </div>
              <div>
                <label className={labelClass}>Children Count</label>
                <input type="number" min="0" className={inputClass} value={childrenCount} disabled={!isOwnProfile} onChange={(e) => setChildrenCount(e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>
        )}

        {/* SAVE BUTTON */}
        {isOwnProfile && (
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold shadow transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : "Save Profile"}
          </button>
        )}

        {/* CHANGE PASSWORD */}
        {isOwnProfile && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">
              Change Password
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <label className={labelClass}>New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputClass + " pr-12"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button
                onClick={handlePassword}
                disabled={changingPassword}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 text-white py-3 rounded-xl font-semibold shadow transition-all flex items-center justify-center gap-2"
              >
                {changingPassword ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : "Change Password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;