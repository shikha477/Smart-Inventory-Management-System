import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Sidebar({ open = false, onNavigate }) {
  const { user } = useAuth();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/products", label: "Products" },
    { to: "/suppliers", label: "Suppliers" },
    { to: "/inventory", label: "Inventory" },
    { to: "/billing", label: "Billing" },
    // { to: "/report", label: "Report" },
    
  ];

  if (["admin"].includes(user?.role)) {
    links.push(
      { to: "/alerts", label: "Alerts" },
      { to: "/analytics", label: "Analytics" },
      { to: "/forecast", label: "Forecast" }
    );
  }

  if (["admin", "staff"].includes(user?.role)) {
    links.push({ to: "/reports", label: "Reports" });
  }
  
  if (user?.role === "admin") {
    links.push({ to: "/reports", label: "Reports" }, { to: "/users", label: "Users" });
  }



  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-title">SIMS</div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
