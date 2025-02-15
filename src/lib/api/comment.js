import axiosInstance from "../axios";
import { handleApiError } from "../utils/errorHandler";

export const crateComment = async (commentData) => {
  try {
    const response = await axiosInstance.post("/comment", commentData);
    console.log("create comment response", response);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
// comment by post or challenge id
export const fetchComments = async ({ id, contentType, pageParams }) => {
  try {
    const response = await axiosInstance.post(
      `/comment/all/${id}?page=${pageParams}`, // Ensure `page` matches backend query param
      { contentType }
    );
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// delete comment
export const deleteComment = async (commentId) => {
  try {
    const response = await axiosInstance.delete(`/comment/${commentId}`);
    return response.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
export const fetchCountComments = async (postIds, targetType) => {
  try {
    console.log(targetType, postIds);
    const response = await axiosInstance.get("/comment/count", {
      params: {
        targetType,
        postIds: JSON.stringify(postIds),
      },
    });
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
