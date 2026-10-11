import api from "./api";

export const scheduleService = {
  create: (data) => api.post("/schedules", data),
  mySchedules: () => api.get("/schedules/my-schedules"),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  pause: (id) => api.put(`/schedules/${id}/pause`),
  resume: (id) => api.put(`/schedules/${id}/resume`),
  remove: (id) => api.delete(`/schedules/${id}`)
};
