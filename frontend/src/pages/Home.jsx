import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import hero from "../assets/Logo.jpeg";
import tutoring from "../assets/tutoring.webp";
import babysitting from "../assets/babysitting.webp";
import design from "../assets/graphic.webp";
import delivery from "../assets/delivery.jpeg";
import student from "../assets/student.jpeg";

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-14px); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes spin-reverse {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.95); opacity: 0.6; }
    70%  { transform: scale(1.08); opacity: 0; }
    100% { transform: scale(0.95); opacity: 0; }
  }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(210px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(210px) rotate(-360deg); }
  }
  @keyframes orbit-reverse {
    from { transform: rotate(0deg) translateX(175px) rotate(0deg); }
    to   { transform: rotate(-360deg) translateX(175px) rotate(360deg); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }
`;

// ─── Reusable fade-in hook ────────────────────────────────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Services config ──────────────────────────────────────────────────────────
const SERVICES = [
  { img: tutoring,    title: "Tutoring",      price: "$15/hr", emoji: "📚", color: "#0d9488" },
  { img: babysitting, title: "Babysitting",    price: "$15/hr", emoji: "🍼", color: "#f97316" },
  { img: design,      title: "Graphic Design", price: "$20/hr", emoji: "🎨", color: "#8b5cf6" },
  { img: delivery,    title: "Delivery",       price: "$12/hr", emoji: "🚴", color: "#06b6d4" },
];

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  { step: "01", title: "Create Account",  desc: "Sign up as a student or client in under a minute.",              icon: "👤" },
  { step: "02", title: "Post or Apply",   desc: "Clients post jobs, students browse and apply instantly.",        icon: "📋" },
  { step: "03", title: "Connect & Work",  desc: "Chat, agree on terms, and get the job done.",                   icon: "🤝" },
];

// ─── Hero Photo ───────────────────────────────────────────────────────────────
function HeroPhoto({ visible }) {
  return (
    <div
      className="flex justify-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s ease 300ms, transform 0.7s ease 300ms",
      }}
    >
      <div style={{ position: "relative", width: "460px", height: "460px" }}>

        {/* ── Outermost ambient glow ── */}
        <div style={{
          position: "absolute",
          inset: "-60px",
          background: "radial-gradient(circle, rgba(13,148,136,0.18) 0%, rgba(6,182,212,0.08) 50%, transparent 75%)",
          borderRadius: "50%",
          filter: "blur(24px)",
          animation: "pulse-ring 4s ease-out infinite",
          zIndex: 0,
        }} />

        

        {/* ── Orbiting dot 1 ── */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "12px",
          height: "12px",
          marginTop: "-6px",
          marginLeft: "-6px",
          zIndex: 5,
          animation: "orbit 20s linear infinite",
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0d9488, #06b6d4)",
            boxShadow: "0 0 12px rgba(13,148,136,0.8)",
          }} />
        </div>

        {/* ── Orbiting dot 2 ── */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "8px",
          height: "8px",
          marginTop: "-4px",
          marginLeft: "-4px",
          zIndex: 5,
          animation: "orbit-reverse 14s linear infinite",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#f97316",
            boxShadow: "0 0 10px rgba(249,115,22,0.8)",
          }} />
        </div>

        {/* ── Gradient backdrop card ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "40px",
          background: "linear-gradient(135deg, rgba(13,148,136,0.12), rgba(6,182,212,0.08))",
          transform: "rotate(4deg) scale(1.04)",
          zIndex: 1,
        }} />

        {/* ── Second tilted card ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "40px",
          background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.06))",
          transform: "rotate(-3deg) scale(1.02)",
          zIndex: 1,
        }} />

        {/* ── Main image ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "36px",
            overflow: "hidden",
            zIndex: 2,
            boxShadow: "0 30px 80px rgba(13,148,136,0.25), 0 8px 24px rgba(0,0,0,0.12)",
            animation: visible ? "float 6s ease-in-out infinite" : "none",
            border: "4px solid rgba(255,255,255,0.9)",
          }}
        >
          <img
            src={student}
            alt="Student working"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Image overlay shimmer */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(13,148,136,0.08) 0%, transparent 50%, rgba(6,182,212,0.05) 100%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ── Floating badge: Students ── */}
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "-28px",
          zIndex: 10,
          background: "white",
          borderRadius: "18px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(13,148,136,0.15)",
          border: "1px solid rgba(13,148,136,0.12)",
          animation: visible ? "fadeSlideUp 0.6s ease 0.8s both" : "none",
        }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "12px",
            background: "linear-gradient(135deg, #0d9488, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem",
          }}>🎓</div>
          <div>
            <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: 0 }}>Students Registered</p>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>2,000+ Active</p>
          </div>
        </div>

        {/* ── Floating badge: Rating ── */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "-28px",
          zIndex: 10,
          background: "white",
          borderRadius: "18px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(249,115,22,0.1)",
          border: "1px solid rgba(249,115,22,0.12)",
          animation: visible ? "fadeSlideUp 0.6s ease 1s both" : "none",
        }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "12px",
            background: "linear-gradient(135deg, #f97316, #fbbf24)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem",
          }}>⭐</div>
          <div>
            <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: 0 }}>Platform Rating</p>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>4.8 / 5.0</p>
          </div>
        </div>

        {/* ── Floating badge: Jobs ── */}
        <div style={{
          position: "absolute",
          top: "42%",
          right: "-36px",
          zIndex: 10,
          background: "white",
          borderRadius: "14px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
          border: "1px solid rgba(139,92,246,0.12)",
          animation: visible ? "fadeSlideUp 0.6s ease 1.2s both" : "none",
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "10px",
            background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem",
          }}>✅</div>
          <div>
            <p style={{ fontSize: "0.65rem", color: "#94a3b8", margin: 0 }}>Jobs Completed</p>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>850+ Done</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── ServiceCard ──────────────────────────────────────────────────────────────
function ServiceCard({ item, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: "24px",
        padding: "28px 20px",
        textAlign: "center",
        cursor: "pointer",
        transform: hovered ? "translateY(-10px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? `0 24px 50px ${item.color}22, 0 8px 20px rgba(0,0,0,0.06)`
          : "0 4px 16px rgba(0,0,0,0.07)",
        border: `2px solid ${hovered ? item.color + "30" : "transparent"}`,
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s",
      }} />

      <div style={{
        fontSize: "2.5rem",
        marginBottom: "12px",
        display: "block",
        transform: hovered ? "scale(1.25) rotate(10deg)" : "scale(1) rotate(0deg)",
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {item.emoji}
      </div>

      <div style={{
        width: "88px", height: "88px",
        borderRadius: "20px",
        overflow: "hidden",
        margin: "0 auto 16px",
        border: `3px solid ${hovered ? item.color + "40" : "#f1f5f9"}`,
        transition: "border-color 0.3s",
        boxShadow: hovered ? `0 8px 24px ${item.color}30` : "none",
      }}>
        <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "6px" }}>
        {item.title}
      </h3>
      <p style={{
        fontSize: "0.875rem",
        fontWeight: 600,
        color: item.color,
        background: `${item.color}12`,
        display: "inline-block",
        padding: "3px 12px",
        borderRadius: "99px",
      }}>
        {item.price}
      </p>
    </div>
  );
}

// ─── StepCard ─────────────────────────────────────────────────────────────────
function StepCard({ step, index }) {
  const [hovered, setHovered] = useState(false);
  const [filled,  setFilled]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 400 + index * 200);
    return () => clearTimeout(t);
  }, [index]);

  const accentColor = ["#0d9488", "#06b6d4", "#f97316"][index] ?? "#0d9488";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "36px 32px 32px",
        borderRadius: "20px",
        background: hovered ? `linear-gradient(145deg, #fff 60%, ${accentColor}10)` : "#fff",
        boxShadow: hovered
          ? `0 20px 50px ${accentColor}25, 0 4px 16px rgba(0,0,0,0.06)`
          : "0 4px 20px rgba(0,0,0,0.06)",
        border: `2px solid ${hovered ? accentColor + "40" : "#f0fdf9"}`,
        transform: hovered ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.4s cubic-bezier(0.34,1.4,0.64,1)",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, height: "4px",
        width: filled ? "100%" : "0%",
        background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
        transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${index * 200}ms`,
        borderRadius: "20px 20px 0 0",
      }} />

      <span style={{
        position: "absolute", top: "-8px", right: "14px",
        fontSize: "5.5rem", fontWeight: 900,
        color: hovered ? `${accentColor}12` : "rgba(0,0,0,0.04)",
        lineHeight: 1, userSelect: "none", transition: "color 0.4s",
      }}>
        {step.step}
      </span>

      <div style={{
        width: "64px", height: "64px", borderRadius: "16px",
        background: hovered ? accentColor : `${accentColor}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.75rem", margin: "0 auto 20px",
        transform: hovered ? "rotate(-6deg) scale(1.1)" : "rotate(0deg) scale(1)",
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: hovered ? `0 8px 20px ${accentColor}40` : "none",
      }}>
        <span style={{ filter: hovered ? "brightness(10)" : "none", transition: "filter 0.3s" }}>
          {step.icon}
        </span>
      </div>

      <div style={{
        display: "inline-block", fontSize: "0.65rem", fontWeight: 700,
        letterSpacing: "0.12em", color: accentColor,
        background: `${accentColor}15`, padding: "3px 10px",
        borderRadius: "99px", marginBottom: "10px", textTransform: "uppercase",
      }}>
        Step {step.step}
      </div>

      <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "8px", color: "#1e293b" }}>
        {step.title}
      </h3>
      <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7 }}>{step.desc}</p>

      <div style={{
        marginTop: "20px", display: "flex", alignItems: "center",
        justifyContent: "center", gap: "6px", fontSize: "0.8rem",
        fontWeight: 600, color: accentColor,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateY(0)" : "translateY(6px)",
        transition: "all 0.3s ease",
      }}>
        Learn more <span>→</span>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ background: "linear-gradient(135deg, #0f172a 0%, #134e4a 100%)", color: "#cbd5e1" }}>
      <div className="px-20 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-white text-xl font-bold mb-3">Study2Work</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              Connecting talented university students with real-world opportunities. Build your career while you study.
            </p>
          </div>
          {[
            { heading: "Platform", links: ["Browse Jobs", "Post a Job", "How It Works", "Pricing"] },
            { heading: "Company",  links: ["About Us", "Blog", "Careers", "Contact"] },
            { heading: "Support",  links: ["Help Center", "Privacy Policy", "Terms of Service", "Accessibility"] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">{heading}</h4>
              <ul className="space-y-2 text-sm">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{ color: "#94a3b8", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#2dd4bf")}
                      onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "24px" }} />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: "#64748b" }}>
          <p>© {currentYear} Study2Work. All rights reserved.</p>
          <div className="flex gap-4">
            {["𝕏", "in", "f", "📸"].map((icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(13,148,136,0.3)"; e.currentTarget.style.color = "#2dd4bf"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94a3b8"; }}
              >{icon}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ role, userName, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="flex justify-between items-center px-20 py-4 sticky top-0 z-50"
      style={{
        background: scrolled ? "rgba(255,255,255,0.95)" : "white",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="flex items-center gap-3">
        <img src={hero} alt="logo" className="w-50 h-50 object-contain" />
      </div>
      <div className="flex items-center gap-8 text-gray-600 font-medium">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/jobs">Browse Jobs</NavLink>
        {role === "student" && <NavLink to="/my-applications">My Applications</NavLink>}
        {role === "client" && (
          <>
            <NavLink to="/post">Post a Job</NavLink>
            <NavLink to="/client-applications">Client Applications</NavLink>
          </>
        )}
        {role === "admin" && <NavLink to="/admin">Admin Dashboard</NavLink>}
        <NavLink to="/reviews">Reviews</NavLink>
        <NavLink to="/about">About Us</NavLink>
        {!userName ? (
          <>
            <Link to="/login">
              <button className="px-4 py-2 border rounded-xl hover:bg-gray-100 transition">Login</button>
            </Link>
            <Link to="/register">
              <button
                className="px-4 py-2 rounded-xl text-white transition shadow"
                style={{ background: "#0d9488" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0f766e")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0d9488")}
              >Register</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="font-semibold" style={{ color: "#0d9488" }}>
              Hello, {userName} 👋
            </Link>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl text-white transition shadow"
              style={{ background: "#ef4444" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
            >Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="relative font-medium text-gray-600 transition"
      style={{ textDecoration: "none" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#0d9488")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
    >{children}</Link>
  );
}

// ─── CTAButton ────────────────────────────────────────────────────────────────
function CTAButton({ to, color, hover, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="px-6 py-3 rounded-xl text-white font-semibold shadow"
        style={{
          background: hovered ? hover : color,
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered ? `0 8px 20px ${color}55` : `0 4px 12px ${color}33`,
          transition: "all 0.25s ease",
        }}
      >{children}</button>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Home() {
  const role     = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
const [search,setSearch]=useState("");
  const [heroRef,     heroVisible]     = useFadeIn(0.1);
  const [servicesRef, servicesVisible] = useFadeIn(0.1);
  const [stepsRef,    stepsVisible]    = useFadeIn(0.1);

  const handleLogout = () => {
    ["role", "userName", "userId", "user"].forEach((k) => localStorage.removeItem(k));
    navigate("/");
    window.location.reload();
  };
      const handleSearch =()=> { 
        navigate(`/jobs?search=${search}`);
      }
  const fadeStyle = (visible, delay = 0) => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  });

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <style>{GLOBAL_CSS}</style>

      <Navbar role={role} userName={userName} onLogout={handleLogout} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative grid md:grid-cols-2 gap-10 items-center px-20 py-20 overflow-hidden"
        style={{ minHeight: "calc(90vh - 80px)" }}
      >
        {/* Hero background blobs */}
        <div style={{
          position: "absolute", top: "-100px", right: "-100px",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 65%)",
          borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", left: "-80px",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%)",
          borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        }} />

        {/* Left */}
        <div className="relative z-10" style={fadeStyle(heroVisible, 0)}>
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{ background: "#ccfbf1", color: "#0d9488" }}
          >
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#0d9488", animation: "pulse-ring 2s ease-out infinite",
              display: "inline-block",
            }} />
            🎓 Built for university students
          </span>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Connect Students with{" "}
            <span style={{
              background: "linear-gradient(90deg, #0d9488, #06b6d4, #8b5cf6, #0d9488)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}>
              Real Work
            </span>
          </h1>

          <p className="text-gray-500 mb-8 text-lg leading-relaxed" style={{ maxWidth: "480px" }}>
            A platform that connects university students with clients for flexible
            jobs, projects, and skill-based work.
          </p>

          {/* Search bar */}
          <div
            className="flex overflow-hidden mb-8"
            style={{
              borderRadius: "16px",
              boxShadow: "0 8px 30px rgba(13,148,136,0.15)",
              border: "2px solid #e2e8f0",
              transition: "box-shadow 0.3s, border-color 0.3s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(13,148,136,0.3)";
              e.currentTarget.style.borderColor = "#0d9488";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(13,148,136,0.15)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <input
              className="flex-1 px-5 py-3.5 outline-none bg-white text-gray-700"
              placeholder="Search jobs, services..."
              value={search}
              onChange={(e)=>
                setSearch(e.target.value)
              }
            />
            <button
            onClick={handleSearch}
              className="px-7 font-semibold text-white transition"
              style={{ background: "#0d9488" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0f766e")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0d9488")}
            >Search</button>
          </div>

          {/* Trusted by strip */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex -space-x-2">
              {["#0d9488","#06b6d4","#f97316","#8b5cf6"].map((c, i) => (
                <div key={i} style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: c, border: "2px solid white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", color: "white", fontWeight: 700,
                }}>
                  {["S","C","M","A"][i]}
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              <span style={{ fontWeight: 700, color: "#0d9488" }}>2,000+</span> students already joined
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap">
            {!role && (
              <>
                <CTAButton to="/jobs"     color="#0d9488" hover="#0f766e">Explore Jobs →</CTAButton>
                <CTAButton to="/register" color="#f97316" hover="#ea580c">Join Now 🚀</CTAButton>
              </>
            )}
            {role === "student" && (
              <>
                <CTAButton to="/jobs"            color="#0d9488" hover="#0f766e">Explore Jobs →</CTAButton>
                <CTAButton to="/my-applications" color="#2563eb" hover="#1d4ed8">My Applications</CTAButton>
              </>
            )}
            {role === "client" && (
              <>
                <CTAButton to="/post"               color="#f97316" hover="#ea580c">Post a Job</CTAButton>
                <CTAButton to="/client-applications" color="#2563eb" hover="#1d4ed8">View Applications</CTAButton>
              </>
            )}
            {role === "admin" && (
              <CTAButton to="/admin" color="#7c3aed" hover="#6d28d9">Admin Dashboard</CTAButton>
            )}
          </div>
        </div>

        {/* Right — enhanced hero photo */}
        <div className="relative z-10">
          <HeroPhoto visible={heroVisible} />
        </div>
      </section>

      {/* ── Popular Services ─────────────────────────────────────────────── */}
      <section ref={servicesRef} className="px-20 pb-20">
        <div style={fadeStyle(servicesVisible, 0)}>
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#0d9488" }}>
            What students offer
          </p>
          <h2 className="text-3xl font-bold mb-10 text-gray-800">Popular Services</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {SERVICES.map((item, index) => (
            <div key={index} style={fadeStyle(servicesVisible, index * 80)}>
              <ServiceCard item={item} index={index} />
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section
        ref={stepsRef}
        className="px-20 py-20"
        style={{ background: "linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 50%, #f0f9ff 100%)" }}
      >
        <div className="grid md:grid-cols-5 gap-16 items-start">
          <div className="md:col-span-2" style={fadeStyle(stepsVisible, 0)}>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>
              Simple process
            </p>
            <h2 className="text-4xl font-bold text-gray-800 leading-tight mb-5">
              How It <span style={{ color: "#0d9488" }}>Works</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8" style={{ fontSize: "0.95rem" }}>
              Getting started takes less than two minutes. Whether you're a student
              looking for your first gig or a client needing help fast — we've made
              the process frictionless.
            </p>
            <div className="flex gap-6 mb-8">
              {[
                { value: "2,000+", label: "Active Students" },
                { value: "850+",   label: "Jobs Posted"     },
                { value: "98%",    label: "Satisfaction"    },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: "#0d9488" }}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <CTAButton to="/register" color="#0d9488" hover="#0f766e">Get Started  →</CTAButton>
            <p className="text-xs text-gray-400 mt-4">No credit card required • Free for students</p>
          </div>

          <div className="md:col-span-3" style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: "48px", left: "31px",
              width: "2px", height: "calc(100% - 96px)",
              background: "linear-gradient(to bottom, #0d9488, #06b6d4, #f97316)",
              opacity: 0.2, zIndex: 0,
            }} />
            <div className="flex flex-col gap-5" style={{ position: "relative", zIndex: 1 }}>
              {STEPS.map((step, index) => (
                <div key={index} style={fadeStyle(stepsVisible, index * 150)}>
                  <StepCard step={step} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;