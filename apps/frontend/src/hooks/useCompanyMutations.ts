import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "../services/companyService";
import { Company } from "../types";
import toast from "react-hot-toast";

export function useCompanyMutations(
  id: string,
  setIsEditing?: (v: boolean) => void
) {
  const queryClient = useQueryClient();

  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => companyService.uploadLogo(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      toast.success("Logo uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload logo");
    },
  });

  const deleteLogoMutation = useMutation({
    mutationFn: () => companyService.deleteLogo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      toast.success("Logo deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete logo");
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (data: Partial<Company>) =>
      companyService.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      if (setIsEditing) setIsEditing(false);
      toast.success("Company updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update company");
    },
  });

  return { uploadLogoMutation, deleteLogoMutation, updateCompanyMutation };
}
