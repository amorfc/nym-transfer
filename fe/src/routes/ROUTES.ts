export const ROUTES = {
  BASE: "/",
  BENCHMARK: "/benchmark",
  DOWNLOAD: "/download/*",
  NOT_FOUND: "*", // Wildcard route for unknown paths
  UPLOAD: "/upload",
  UPLOAD_TEST: "/upload-test",
  WASM_TEST: "/wasm-test",
};

export type RouteKey = keyof typeof ROUTES;

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
