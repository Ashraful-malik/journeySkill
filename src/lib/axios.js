import axios from "axios";
// create an instance of axios with a default config
// this instance will have the baseURL set to "/api"
// and the Content-Type header set to "application/json"
const axiosInstance = axios.create({
  baseURL: "/api",
});
export default axiosInstance;
