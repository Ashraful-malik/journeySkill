import axiosInstance from "../axios";
import { handleApiError } from "../utils/errorHandler";

//** @param {mongodb id} userId - The ID of the user
//** @param {string} page - The onboarding page to check
// ** page is the page number of onboarding.

// get onboarding information
export const getOnboarding = async (userId, page) => {
  try {
    const response = await axiosInstance.get(`/users/onboarding`, {
      params: {
        userId,
        page,
      },
    });
    return response.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// post onboarding page value
export const postOnboarding = async (userId, page) => {
  try {
    const response = await axiosInstance.post(`/users/onboarding`, {
      userId,
      page,
    });
    return response.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
