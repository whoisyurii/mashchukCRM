import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

const DropdownMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  return (
    <div className="absolute right-0 mt-2 w-54 bg-dark-800 border border-dark-800 rounded-lg shadow-lg z-50">
      <div className="p-3 border-b border-dark-700">
        <p className="text-sm font-medium text-white">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-gray-400">{user?.email}</p>
      </div>

      <div className="py-2">
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
        >
          <User className="w-4 h-4" />
          Profile
        </button>
      </div>

      <div className="border-t border-dark-700 py-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default DropdownMenu;
