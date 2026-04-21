import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("sims_theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sims_theme", theme);
  }, [theme]);

  return (
    <header className="topbar">
      <div className="topbar-title-group">
        <button type="button" className="menu-button" onClick={onMenuClick} aria-label="Toggle menu">
          Menu
        </button>
        <h1 className="brand">Smart Inventory System</h1>
        <p className="subtle-text">Manage stock, billing, and analytics from one place.</p>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="btn btn-secondary btn-chip"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
        <div className="user-pill">
          <span>{user?.name}</span>
          <small>{user?.role}</small>
        </div>
        <button type="button" className="btn btn-danger btn-chip" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
