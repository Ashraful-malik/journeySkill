import axiosInstance from "../axios";
import { handleApiError } from "../utils/errorHandler";

// create view
export const createView = async (viewData) => {
  try {
    console.log("viewData", viewData);
    const response = await axiosInstance.post("views/recordViews", viewData);
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};

// fetch all views
export const fetchViews = async (viewData) => {
  try {
    const response = await axiosInstance.post(`/views`, viewData);
    return response.data.data;
  } catch (error) {
    const { message, code } = handleApiError(error);
    throw { message, code };
  }
};
