import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { TUserRegistrationInput } from "@workspace/types";
// Create a base axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:6969/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Generic API request function
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Extract error message from API response if available
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// API service functions
export const authService = {
  signup: (userData: TUserRegistrationInput) =>
    apiRequest({
      method: "POST",
      url: "/auth/register",
      data: userData,
    }),
  authCheck: () =>
    apiRequest({
      method: "GET",
      url: "/auth/auth-check",
    }),
  getNonce: () =>
    apiRequest({
      method: "GET",
      url: "/auth/get-nonce",
    }),
};

export const appointmentService = {
  bookAppointment: (appointmentData: any) =>
    apiRequest({
      method: "POST",
      url: "/user/book-appointment",
      data: appointmentData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }),
  getAllAppointments: () =>
    apiRequest({
      method: "GET",
      url: "/user/get-appointments",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }),
};

export const medicationService = {
  getUploadUrl: (fileName: string, fileType: string) =>
    apiRequest({
      method: "POST",
      url: "/medications/get-upload-url",
      data: { fileName, fileType },
    }),
  uploadToUrl: (url: string, file: File) =>
    axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    }),
  confirmUpload: (fileData: any) =>
    apiRequest({
      method: "POST",
      url: "/medications/confirm-upload",
      data: fileData,
    }),
  getAllMedications: () =>
    apiRequest({
      method: "GET",
      url: "/medications",
    }),
  testDrugInteraction: (medications: string[]) =>
    apiRequest({
      method: "POST",
      url: "/medications/drug-interaction",
      data: { medications },
    }),
};

export const hospitalService = {
  getAllHospitals: () =>
    apiRequest({
      method: "GET",
      url: "/hospital/get-all-hospitals",
    }),
  getHospitalById: (hospitalId: string) =>
    apiRequest({
      method: "GET",
      url: `/hospital/${hospitalId}`,
    }),
};

export const doctorService = {
  getAvailableSlots: (doctorId: string) =>
    apiRequest({
      method: "GET",
      url: `/doctor/get-available-slots/${doctorId}`,
    }),
};
export default apiClient;
