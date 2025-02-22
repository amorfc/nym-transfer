import { UploadMixnetResponseData } from "@/service/response/UploadMixnetResponse";
const downloadPath = "/download";
export const useNymFileLink = () => {
  const createNymDownloadLink = (params: UploadMixnetResponseData) => {
    const { path } = params;
    return `${window.location.origin}${downloadPath}/${path}`;
  };

  return { createNymDownloadLink };
};
