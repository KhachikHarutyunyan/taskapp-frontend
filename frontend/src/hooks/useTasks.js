import { useQuery } from "@tanstack/react-query";
import { TaskService } from "@/api/tasks";

export const useTasks = (byOwner) => {
  return useQuery({
    queryKey: ["tasks", byOwner],
    queryFn: () => TaskService.getAll(byOwner),
  });
};