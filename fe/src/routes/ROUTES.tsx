export const ROUTES = {
  UPLOAD: "/upload",
  DOWNLOAD: "/download/:fileId/:name",
  BASE: "/",
  NOT_FOUND: "*", // Wildcard route for unknown paths
};

/**
 * Utility function to replace dynamic route parameters.
 */
export const getRoute = (path: string, params: { [key: string]: string }) => {
  let result = path;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, value);
  }
  return result;
};
