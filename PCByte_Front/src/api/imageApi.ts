import adminApi from "./adminApi";

interface ImageUploadResponse {
  imageUrl: string;
}

export const uploadProductImage = async (
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response =
    await adminApi.post<ImageUploadResponse>(
      "/images/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

  if (!response.data?.imageUrl) {
    throw new Error(
      "El servidor no devolvió la URL de la imagen."
    );
  }

  return response.data.imageUrl;
};