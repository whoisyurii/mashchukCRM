import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, User } from "../services/userService";
import { userNotifications } from "../utils/toast-helpers";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      userNotifications.deleteSuccess();
    },
    onError: (error) => {
      console.error("Delete error:", error);
      userNotifications.deleteError();
    },
  });
};

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
    }) => userService.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      userNotifications.updateSuccess();
    },
    onError: (error) => {
      console.error("Update error:", error);
      userNotifications.updateError();
    },
  });
};

// Helper hook for user operations
export const useUserOperations = () => {
  const deleteUserMutation = useDeleteUser();
  const handleDeleteUser = async (user: User) => {
    if (userNotifications.confirmDelete(`${user.firstName} ${user.lastName}`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  return {
    deleteUser: handleDeleteUser,
    isDeleting: deleteUserMutation.isPending,
  };
};
