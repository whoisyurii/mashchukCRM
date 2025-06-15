export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "SuperAdmin":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "Admin":
      return "bg-yellow-600/10 text-yellow-400 border-yellow-500/20";
    case "User":
      return "bg-emerald-400/10 text-emerald-400 border-emerald-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export const formatUserName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};

export const formatUserRole = (role: string) => {
  switch (role) {
    case "SuperAdmin":
      return "Super Admin";
    case "Admin":
      return "Admin";
    case "User":
      return "User";
    default:
      return role;
  }
};
