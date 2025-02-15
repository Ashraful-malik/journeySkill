import axiosInstance from "../axios";
import { handleApiError } from "../utils/errorHandler";
import qs from "qs";
// crate like
export const createLike = async ({ actions }) => {
  try {
    const response = await axiosInstance.post("/like", {
      batchActions: actions,
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// get all like
export const fetchLikes = async (postIds, userId, targetType) => {
  try {
    const response = await axiosInstance.get(`/like/all`, {
      params: {
        postIds, // Pass as array directly
        userId,
        targetType,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          arrayFormat: "repeat", // Correct format for Express
        });
      },
    });
    console.log("all likes response", response.data.data);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
