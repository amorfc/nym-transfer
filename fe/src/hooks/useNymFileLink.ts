import { UploadMixnetResponseData } from "@/service/response/UploadMixnetResponse";
const baseUrl = "http://localhost:5173";
const downloadPath = "/download";
export const useNymFileLink = () => {
  const createNymDownloadLink = (params: UploadMixnetResponseData) => {
    const { path } = params;
    return `${baseUrl}${downloadPath}${path}`;
  };

  return { createNymDownloadLink };
};
