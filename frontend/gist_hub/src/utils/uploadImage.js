import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axioInstance";

const uploadImage = async (imageFile) => {
  console.log("uploadImage called with:", imageFile);

  const formData = new FormData();
  formData.append("image", imageFile);

  console.log("FormData created, checking contents:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
export default uploadImage;
