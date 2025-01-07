import axiosInstance from "./auth";
import { Trip } from "../types";

export const fetchTrips = async (): Promise<Trip[]> => {
  const response = await axiosInstance.get<Trip[]>("/trips");
  return response.data;
};

export const createTrip = async (tripData: Partial<Trip>): Promise<Trip> => {
  const response = await axiosInstance.post<Trip>("/trips", tripData);
  return response.data;
};

export const fetchTripDetails = async (tripId: string): Promise<Trip> => {
  const response = await axiosInstance.get<Trip>(`/trips/${tripId}`);
  return response.data;
};

export const addMemberToTrip = async (
  tripId: string,
  email: string
): Promise<Trip> => {
  const response = await axiosInstance.post<Trip>(`/trips/${tripId}/members`, {
    email,
  });
  return response.data;
};

export const removeMemberFromTrip = async (
  tripId: string,
  memberId: string
): Promise<Trip> => {
  const response = await axiosInstance.delete<Trip>(
    `/trips/${tripId}/members/${memberId}`
  );
  return response.data;
};

export const updateTripStatus = async (
  tripId: string,
  status: "active" | "completed"
): Promise<Trip> => {
  const response = await axiosInstance.post<Trip>(`/trips/${tripId}/status`, {
    status,
  });
  return response.data;
};
