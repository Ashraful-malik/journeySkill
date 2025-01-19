import axiosInstance from "../axios";
import { handleApiError } from "../utils/errorHandler";

// fetch all challenges
export const fetchChallenges = async () => {
  try {
    const response = await axiosInstance.get("/challenge/all");
    return response.data.data;
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
    console.log(response);
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
export const fetchUserChallenges = async (userId) => {
  try {
    const response = await axiosInstance.get(`/challenge/user/${userId}`);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
