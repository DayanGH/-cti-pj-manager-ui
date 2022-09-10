import { axiosInstance } from "./axios";

export async function createToken(data) {
  try {
    const response = await axiosInstance.post("/login/", data);
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function refreshToken(refresh) {
  try {
    const response = await axiosInstance.post("/login/refresh/", {
      refresh,
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function verifyToken(token) {
  try {
    const response = await axiosInstance.post("/login/verify/", {
      token,
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
export const fetchProjects = async () => {
  const response = await axiosInstance.get("/projects/");
  return response.data;
};