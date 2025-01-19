import axiosInstance from "../axios";
import { handleApiError } from "../utils/errorHandler";

// fetch  all post as feed
export const fetchPosts = async () => {
  try {
    const response = await axiosInstance.get("/posts/feed");

    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// create post
export const createPostApi = async (postData) => {
  try {
    const response = await axiosInstance.post("/posts", postData);
    console.log("create post response", response);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// upload post Image
export const uploadPostImage = async ({ file, userId }) => {
  console.log("file from api", file);
  console.log("userId from api", userId);
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedImageTypes.includes(file.type)) {
    throw new Error("Please select an image file.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", `user/${userId}/post`); // 'profile', 'banner', or 'post'
  formData.append("type", "post");

  try {
    const response = await axiosInstance.post("/upload/post", formData);
    return response.data.data;
  } catch (error) {
    console.error(error);
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// get all user post by id
export const fetchUserPosts = async (userId) => {
  try {
    const response = await axiosInstance.get(`/posts/user/${userId}`);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
