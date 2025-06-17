// Simple alert-based notifications
// Can be later replaced with proper toast library like react-hot-toast

export const showSuccessMessage = (message: string) => {
  alert(message);
};

export const showErrorMessage = (message: string) => {
  alert(message);
};

export const showSuccessToast = showSuccessMessage;
export const showErrorToast = showErrorMessage;

export const showConfirmDialog = (message: string): boolean => {
  return confirm(message);
};

// User-specific notifications
export const userNotifications = {
  deleteSuccess: () => showSuccessMessage("User deleted successfully!"),
  deleteError: () =>
    showErrorMessage("Failed to delete user. Please try again."),
  updateSuccess: () => showSuccessMessage("User updated successfully!"),
  updateError: () =>
    showErrorMessage("Failed to update user. Please try again."),
  confirmDelete: (userName: string) =>
    showConfirmDialog(`Are you sure you want to delete ${userName}?`),
};
