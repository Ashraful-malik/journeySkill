export const handleApiError = (error) => {
  let errorMessage = "An unKnown error occurred";
  let errorCode = 500;
  //check if the response is an axios error
  if (error.response) {
    const { data, status } = error.response;
    // Extract the error message from response
    errorMessage =
      data?.errors ||
      data?.message ||
      "Something went wrong. Please try again.";
    errorCode = status || 500;
  } else if (error.request) {
    // Network errors (e.g., no response from server)
    errorMessage = "Network error. Please check your internet connection.";
    errorCode = 500;
  } else {
    // Any other unexpected error
    errorMessage = error.message || errorMessage;
    errorCode = 500;
  }

  return { message: errorMessage, code: errorCode };
};
