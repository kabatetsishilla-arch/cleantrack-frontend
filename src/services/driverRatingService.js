import api from "./api";

export const driverRatingService = {
  create: (data) => api.post("/driver-ratings", data),
  myRatings: () => api.get("/driver-ratings/my"),
  forPickup: (pickupId) => api.get(`/driver-ratings/pickup/${pickupId}`),
  summary: () => api.get("/driver-ratings/summary")
};
