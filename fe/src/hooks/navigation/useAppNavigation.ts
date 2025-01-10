import { NavigateOptions, useNavigate } from "react-router";
import { ROUTES, getRoute } from "@/routes/ROUTES";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goToUpload: (options?: NavigateOptions) => {
      navigate(ROUTES.UPLOAD, options);
    },

    /**
     * Navigate to the Download route with a dynamic parameter
     * @param path - The path parameter for the download route
     */
    goToDownload: (path: string, options?: NavigateOptions) => {
      const downloadPath = getRoute(ROUTES.DOWNLOAD, { path });
      navigate(downloadPath, options);
    },

    goToCustomRoute: (route: string, options?: NavigateOptions) => {
      navigate(route, options);
    },
  };
};
