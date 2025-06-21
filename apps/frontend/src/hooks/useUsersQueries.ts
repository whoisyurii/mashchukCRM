import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, User } from "../services/userService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Custom hook to fetch users
export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });
};
// create user hook
export function useCreateUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
      navigate('/users');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  });
}
// hook to delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete user. Please try again.");
    },
  });
};
 // update user hook
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: {
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    }) => userService.updateUser(userId, userData),    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });
};

// helper hook for user operations
export const useUserOperations = () => {
  const deleteUserMutation = useDeleteUser();  const handleDeleteUser = async (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  return {
    deleteUser: handleDeleteUser,
    isDeleting: deleteUserMutation.isPending,
  };
};
