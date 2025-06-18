export { AddUserModal } from './AddUserModal';

// Types
export interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyIds?: string[];
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SuperAdmin" | "Admin" | "User";
  avatar?: string;
  createdAt: string;
}
