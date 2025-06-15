import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  History,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "History", href: "/history", icon: History },
  { name: "Profile", href: "/profile", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="w-20 md:hover:w-56 bg-dark-900 border-r border-dark-800 flex flex-col transition-all duration-300 group">
      <div className="h-20 px-6 border-b border-dark-800 flex items-center">
        <button className="flex items-center gap-2" onClick={handleLogoClick}>
          <Building2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          <span className="text-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            MyCRM
          </span>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-gray-300 hover:text-white hover:bg-dark-800"
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-dark-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-sm font-medium text-red-500 hover:text-red-400 hover:bg-dark-800 transition-all duration-300"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
};
