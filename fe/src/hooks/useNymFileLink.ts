import { UploadMixnetResponseData } from "@/service/response/UploadMixnetResponse";
import { Env } from "@/env";
const downloadPath = "/download";
export const useNymFileLink = () => {
  const createNymDownloadLink = (params: UploadMixnetResponseData) => {
    const { path } = params;
    return `${Env.DOMAIN_BASE_URL}${downloadPath}${path}`;
  };

  return { createNymDownloadLink };
};
