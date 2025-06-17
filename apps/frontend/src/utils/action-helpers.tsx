import { Building2, Users, Edit3, Plus, Trash2 } from "lucide-react";

export const getActionIcon = (type: string, action: string) => {
  if (action === "created") {
    switch (type) {
      case "company":
        return <Building2 className="w-3 h-3 text-green-400" />;
      case "user":
        return <Users className="w-3 h-3 text-green-400" />;
      default:
        return <Plus className="w-3 h-3 text-green-400" />;
    }
  } else if (action === "updated") {
    return <Edit3 className="w-3 h-3 text-emerald-400" />;
  } else if (action === "deleted") {
    return <Trash2 className="w-3 h-3 text-red-500" />;
  } else {
    return <Edit3 className="w-3 h-3 text-yellow-500" />;
  }
};

export const getActionColor = (action: string) => {
  switch (action) {
    case "created":
      return "bg-green-500";
    case "updated":
      return "bg-blue-500";
    case "deleted":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};
