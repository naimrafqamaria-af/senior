import { Link } from "react-router-dom";
import student from "../assets/student.jpeg";

function About() {
  const features = [
    {
      icon: "🕐",
      title: "Flexible Work",
      description:
        "Students can take on tasks that fit their schedule — no rigid hours, no conflicts with classes.",
      color: "from-teal-400 to-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100",
      badge: "teal",
    },
    {
      icon: "🛡️",
      title: "Trusted Platform",
      description:
        "Every student is university-verified. Clients get skilled, motivated help they can count on.",
      color: "from-blue-400 to-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      badge: "blue",
    },
    {
      icon: "🚀",
      title: "Skill Development",
      description:
        "Gain real-world experience that looks great on a CV and sets you apart after graduation.",
      color: "from-purple-400 to-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      badge: "purple",
    },
    {
      icon: "💰",
      title: "Fair Earnings",
      description:
        "Students earn competitive pay for their work, making financial independence more achievable.",
      color: "from-yellow-400 to-orange-400",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      badge: "yellow",
    },
    {
      icon: "🤝",
      title: "Easy Matching",
      description:
        "Our platform connects the right student to the right job quickly and efficiently.",
      color: "from-pink-400 to-rose-500",
      bg: "bg-pink-50",
      border: "border-pink-100",
      badge: "pink",
    },
    {
      icon: "📈",
      title: "Track Progress",
      description:
        "Both students and clients can track job status, reviews, and performance over time.",
      color: "from-emerald-400 to-green-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      badge: "emerald",
    },
  ];

  const stats = [
    { value: "2,000+", label: "Students Registered", icon: "🎓" },
    { value: "850+", label: "Jobs Completed", icon: "✅" },
    { value: "300+", label: "Happy Clients", icon: "😊" },
    { value: "4.8★", label: "Average Rating", icon: "⭐" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      {/* Hero Section */}
      <section className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-6 md:px-20 py-24 overflow-hidden">

        {/* Background decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100 rounded-full opacity-50 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-teal-50 rounded-full opacity-60 blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Left Text */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            About Us
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-gray-900">
            Bridging the Gap Between{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-teal-600">Study & Work</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-teal-100 rounded-full z-0" />
            </span>
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
            Study2Work connects university students with real, flexible work
            opportunities. Whether you're a student looking to earn and grow, or
            a client who needs reliable talent — we make it simple.
          </p>

          <Link
            to="/register"
            className="inline-block bg-teal-600 hover:bg-teal-700 active:scale-95 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-all duration-200"
          >
            Join Us
          </Link>
        </div>

        {/* Right Photo with effects */}
        <div className="relative z-10 flex justify-center">
          <div className="relative w-full max-w-[440px]">

            {/* Blurred glow blobs */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-teal-300 rounded-full opacity-50 blur-3xl z-0" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-500 rounded-full opacity-40 blur-3xl z-0" />

            {/* Rotating dashed ring */}
            <div
              className="absolute inset-0 rounded-3xl border-4 border-dashed border-teal-300 opacity-70 scale-105 animate-spin z-0"
              style={{ animationDuration: "18s" }}
            />

            {/* Second counter-rotating dotted ring */}
            <div
              className="absolute inset-0 rounded-3xl border-2 border-dotted border-teal-400 opacity-40 scale-110 animate-spin z-0"
              style={{ animationDuration: "30s", animationDirection: "reverse" }}
            />

            {/* Offset solid block */}
            <div className="absolute top-5 left-5 w-full h-full bg-teal-500 rounded-3xl opacity-15 z-0" />

            {/* Floating badge — bottom left */}
            <div className="absolute -bottom-5 -left-5 bg-white shadow-xl rounded-2xl px-4 py-3 z-20 flex items-center gap-3 border border-gray-100">
              <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center text-lg">🎓</div>
              <div>
                <p className="text-xs text-gray-400">Students Registered</p>
                <p className="text-sm font-bold text-gray-800">2,000+ Active</p>
              </div>
            </div>

            {/* Floating badge — top right */}
            <div className="absolute -top-5 -right-5 bg-white shadow-xl rounded-2xl px-4 py-3 z-20 flex items-center gap-3 border border-gray-100">
              <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center text-lg">⭐</div>
              <div>
                <p className="text-xs text-gray-400">Platform Rating</p>
                <p className="text-sm font-bold text-gray-800">4.8 / 5.0</p>
              </div>
            </div>

            {/* Main image */}
            <img
              src={student}
              alt="A student working on a laptop"
              className="relative z-10 w-full rounded-3xl shadow-2xl object-cover ring-4 ring-white"
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative bg-teal-600 py-14 px-6 md:px-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-teal-500 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-700 rounded-full opacity-30 translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-96 h-24 bg-teal-400 opacity-10 blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-2xl py-7 px-4 border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-200">
                {stat.icon}
              </div>
              <p className="text-3xl font-extrabold">{stat.value}</p>
              <p className="text-teal-100 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative px-6 md:px-20 py-24 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[350px] bg-teal-50 rounded-full blur-3xl opacity-80" />
        </div>
        <div className="absolute top-8 right-10 w-16 h-16 bg-teal-200 rounded-full opacity-40 blur-xl pointer-events-none" />
        <div className="absolute bottom-8 left-10 w-20 h-20 bg-teal-300 rounded-full opacity-30 blur-xl pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            Our Mission
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Study2Work Exists
          </h2>

          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We believe students shouldn't have to choose between studying and
            gaining real-world experience. Study2Work makes it possible to do
            both — on your terms, at your pace.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="w-16 h-1 bg-teal-200 rounded-full" />
            <div className="w-4 h-4 bg-teal-400 rounded-full animate-pulse" />
            <div className="w-4 h-4 bg-teal-300 rounded-full" />
            <div className="w-4 h-4 bg-teal-400 rounded-full animate-pulse" />
            <div className="w-16 h-1 bg-teal-200 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative bg-white px-6 md:px-20 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-full opacity-60 blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-50 rounded-full opacity-60 blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            Why Choose Us
          </span>
          <h2 className="text-3xl font-bold text-gray-900">
            Everything You Need in One Place
          </h2>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative p-7 rounded-3xl border ${feature.border} ${feature.bg} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}
            >
              {/* Card background glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`} />

              {/* Top gradient accent bar */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} rounded-t-3xl`} />

              {/* Icon container */}
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-5 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-teal-700 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom right subtle arrow that appears on hover */}
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-300 text-lg">
                →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-20 py-20">
        <div className="relative bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl text-white text-center py-16 px-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-teal-100 mb-8 text-lg max-w-xl mx-auto">
              Join thousands of students and clients already using Study2Work to
              make education work for them.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="bg-white text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-teal-50 transition"
              >
                Join Us
              </Link>
              <Link
                to="/"
                className="border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;