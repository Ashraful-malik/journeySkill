import axios from "axios";
import axiosInstance from "../axios";
import { handleApiError } from "../utils/errorHandler";

// Fetch user data in layout.js in react query
export const fetchUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    // Send a GET request to the API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getUser/${userId}` // Endpoint
    );
    return response.data.data; // Clerk session information is here
  } catch (error) {
    const { message, status } = handleApiError(error);
    throw { message, status };
  }
};

// update user data
export const updateUser = async (userId, updatedData) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const response = await axiosInstance.put(`users/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// update user profile image
export const updateUserProfile = async (formData) => {
  console.log(formData);
  try {
    const response = await axiosInstance.post("/upload/profile", formData);
    return response.data;
  } catch (error) {
    console.error(error);
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

export const updateBannerImage = async (formData) => {
  console.log(formData);
  try {
    const response = await axiosInstance.post("/upload/banner", formData);
    return response.data;
  } catch (error) {
    console.error(error);
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
