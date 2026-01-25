'use client'

import { showToast } from "@/lib/showToast";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const useDeleteMutation = (queryKey, deleteEndPoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, deleteType }) => {
      const { data: response } = await axios({
        url: deleteEndPoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType },
      });

      if (!response.success) {
        throw new Error(response.message || "Delete failed");
      }

      return response;
    },
    onSuccess: (data) => {
      showToast("success", data?.message || "Operation successful");
      queryClient.invalidateQueries([queryKey]);
    },
    onError: (error) => {
      showToast("error", error?.message || "Something went wrong");
    },
  });
};

export default useDeleteMutation;