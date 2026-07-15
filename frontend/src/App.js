import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Navigate} from "react-router-dom";
import Home from "./pages/Home";
import BrowseJobs from "./pages/BrowseJobs";
import PostJob from "./pages/PostJob";
import About from "./pages/About"
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyApplications from "./pages/MyApplications"
import ClientApplications from "./pages/ClientApplications";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import ViewProfile from"./pages/ViewProfile";
import MyPostedJobs from "./pages/MyPostedJobs";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/my-posted-jobs"
  element={<MyPostedJobs />}
/>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/post" element={<PostJob />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route
  path="/admin"
  element={
    localStorage.getItem("role") === "admin"
      ? <AdminDashboard />
      : <Navigate to="/" />
  }
/>
<Route path="/my-applications" element={<MyApplications/>} />
<Route path="/client-applications" element={<ClientApplications/>} />
 <Route path="/profile" element={<Profile />} />
 <Route path="/reviews" element={<Reviews />} />
 
 <Route
  path="/profile/:id"
  element={<ViewProfile />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;