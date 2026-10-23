import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";

export const useMe = (enabled) => {
  return useQuery({
    queryKey: ["me"],
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data;
    },
  });
};