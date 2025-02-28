import axiosInstance from "../axios";
import { handleApiError } from "../utils/errorHandler";
import { fetchCountComments } from "./comment";
import { fetchLikes } from "./like";
import { fetchViews } from "./view";

// fetch  all post as feed
export const fetchPosts = async ({ pageParams }) => {
  try {
    const response = await axiosInstance.get(`/posts/feed/?page=${pageParams}`);
    console.log(response);
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
export const fetchUserPosts = async ({ profileUserId, pageParams }) => {
  try {
    const response = await axiosInstance.get(
      `/posts/user/${profileUserId}/?page=${pageParams}`
    );
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
// fetch post by id
export const fetchPostById = async (postId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// fetch all post of challenge
export const fetchChallengePosts = async ({ challengeId, pageParam }) => {
  try {
    const response = await axiosInstance.get(
      `/posts/challengePosts/${challengeId}`,
      {
        params: {
          page: pageParam,
        },
      }
    );
    console.log("all post of challenge", response.data.data);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// delete post
export const deletePost = async (postId) => {
  try {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
// fetching user engeagement metrics
export const fetchEngagementMetrics = async ({
  postIds,
  userId,
  targetType,
  contentType,
}) => {
  const [views, likes, comments] = await Promise.all([
    fetchViews({ postIds, contentType }),
    fetchLikes(postIds, userId, targetType),
    fetchCountComments(postIds, targetType),
  ]);
  // Structure data as a dictionary for quick lookups
  return postIds.reduce((acc, postId) => {
    acc[postId] = {
      views: views[postId] || 0,
      likes: likes[postId] || 0,
      comments: comments[postId] || 0,
    };
    return acc;
  }, {});
};
