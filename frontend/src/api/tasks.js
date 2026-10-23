import api from "./client";

export const TaskService = {
  async getAll(byOwner = false) {
    const { data } = await api.get(
      `/tasks?by_owner=${byOwner}`
    );
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/tasks", payload);
    return data;
  },

  async update(taskId, payload) {
    const { data } = await api.patch(`/tasks/${taskId}`, payload);
    return data;
  },

  async remove(taskId) {
    const { data } = await api.delete(`/tasks/${taskId}`);
    return data;
  },
};