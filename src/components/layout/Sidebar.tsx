import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="w-20 md:hover:w-56 bg-dark-900 border-r border-dark-700 flex flex-col transition-all duration-300 group">
      <div className="h-20 px-6 border-b border-dark-700 flex items-center">
        <div className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-emerald-500 flex-shrink-0" />
          <span className="text-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            MyCRM
          </span>
        </div>
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

      <div className="p-4 border-t border-dark-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-800 transition-all duration-300"
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
