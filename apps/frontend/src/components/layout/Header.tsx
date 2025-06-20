import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import DropdownMenu from "../ui/DropdownMenu";

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getAvatarInitials = () => {
    if (!user) return "U";
    return (
      `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "U"
    );
  };

  return (
    <header className="bg-dark-900 h-20 px-6 flex items-center">
      <div className="flex items-center justify-between w-full">
        <div className="max-md:hidden flex items-center gap-2 text-emerald-400">
          <span className="text-sm font-medium">{date}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative ml-4" ref={dropdownRef}>
            <button
            // onBlur={() => setShowDropdown(!showDropdown)}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {getAvatarInitials()}
                    </span>
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && <DropdownMenu />}
          </div>
        </div>
      </div>
    </header>
  );
};
