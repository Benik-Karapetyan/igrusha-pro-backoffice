import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "x-auth-token": localStorage.getItem("accessToken") || "",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 400) {
      const errorMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : (error.response.data as { message?: string })?.message || "";

      console.log(errorMessage);
      if (errorMessage.toLowerCase().includes("invalid token")) {
        localStorage.removeItem("accessToken");
        // location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export { api };
