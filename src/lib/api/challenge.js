import axiosInstance from "../axios";
import { handleApiError } from "../utils/errorHandler";

// fetch all challenges
export const fetchChallenges = async ({ pageParams }) => {
  try {
    const response = await axiosInstance.get(
      `/challenge/all?page=${pageParams}`
    );
    return response.data.data.pages;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// create challenges
export const createChallengeApi = async (challengeData) => {
  try {
    const response = await axiosInstance.post(
      "/challenge/create",
      challengeData
    );
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// get challenge by id
export const getChallengeById = async (challengeId) => {
  try {
    const response = await axiosInstance.get(`/challenge/${challengeId}`);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
// get all users challenges
export const fetchUserChallenges = async ({ userId, pageParams }) => {
  try {
    const response = await axiosInstance.get(
      `/challenge/user/${userId}/?page=${pageParams}`
    );
    return response.data.data.pages;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// fetch user analytics
export const fetchUserChallengesAnalytics = async (challengeId) => {
  try {
    const response = await axiosInstance.post(`/analytics/${challengeId}`);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// delete challenge
export const deleteChallenge = async (challengeId) => {
  try {
    const response = await axiosInstance.delete(`/challenge/${challengeId}`);
    return response.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
