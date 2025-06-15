import { User } from "../services/userService";

export const filterUsers = (
  users: User[],
  searchTerm: string,
  roleFilter: string
) => {
  return users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });
};

export const paginateArray = <T>(
  array: T[],
  currentPage: number,
  itemsPerPage: number
): {
  paginatedItems: T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
} => {
  const totalPages = Math.ceil(array.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = array.slice(startIndex, endIndex);

  return {
    paginatedItems,
    totalPages,
    startIndex,
    endIndex: Math.min(endIndex, array.length),
  };
};
