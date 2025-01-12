import { z } from "zod";
const logDefaultUsage =
  <T>(key: string, defaultValue: T) =>
  (value: T | undefined) => {
    if (value === undefined) {
      console.warn(`[ENV] Using default value for ${key}: ${defaultValue}`);
      return defaultValue;
    }
    console.warn(`[ENV] Using provided value for ${key}: ${value}`);
    return value;
  };

// Define a custom function to parse a JSON-like string into an array of numbers
// Custom function to parse the environment variable
function parseArrayStringToNumber(value: string): number[] {
  try {
    const trimmedValue = value.trim();
    const parsed = JSON.parse(trimmedValue);
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "number")
    ) {
      return parsed;
    }
    throw new Error("Invalid format for NYM_BACKEND_CLIENT_ADDRESS_BYTES");
  } catch (error) {
    throw new Error(
      `Failed to parse NYM_BACKEND_CLIENT_ADDRESS_BYTES as an array of numbers: ${error}`
    );
  }
}

// Define the schema with a custom transformation
const envSchema = z.object({
  VITE_NYM_ENTRY_CLIENT_WS_URL: z
    .string()
    .url()
    .optional()
    .transform(
      logDefaultUsage("VITE_NYM_ENTRY_CLIENT_WS_URL", "ws://127.0.0.1:1977")
    )
    .describe("Nym Entry Client WebSocket URL"),
  VITE_DOMAIN_BASE_URL: z
    .string()
    .url()
    .optional()
    .transform(logDefaultUsage("VITE_DOMAIN_BASE_URL", "http://localhost:5173"))
    .describe("Domain base URL"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  NYM_BACKEND_CLIENT_ADDRESS_BYTES: z
    .string()
    .transform((value) => {
      const defaultWithLog = logDefaultUsage(
        "NYM_BACKEND_CLIENT_ADDRESS_BYTES",
        "[0, 0, 0, 0]"
      )(value);
      parseArrayStringToNumber(defaultWithLog);
    })
    .describe(
      "Temporary Nym Client Address Byte Array. This is the address of the Nym Client that will be used to connect to the Nym network."
    ), // Use the custom transformation
});

// Parse and validate the environment variables
const parsedEnv = envSchema.parse({
  VITE_DOMAIN_BASE_URL: import.meta.env.VITE_DOMAIN_BASE_URL,
  VITE_NYM_ENTRY_CLIENT_WS_URL: import.meta.env.VITE_NYM_ENTRY_CLIENT_WS_URL,
  NODE_ENV: import.meta.env.MODE,
  NYM_BACKEND_CLIENT_ADDRESS_BYTES: import.meta.env
    .VITE_NYM_BACKEND_CLIENT_ADDRESS_BYTES,
});

// Expose validated and parsed environment variables
export const Env = {
  DOMAIN_BASE_URL: parsedEnv.VITE_DOMAIN_BASE_URL,
  NYM_ENTRY_CLIENT_WS_URL: parsedEnv.VITE_NYM_ENTRY_CLIENT_WS_URL,
  NYM_BACKEND_CLIENT_ADDRESS_BYTES: parseArrayStringToNumber(
    import.meta.env.VITE_NYM_BACKEND_CLIENT_ADDRESS_BYTES
  ), // Now an array of numbers
  IS_DEV: parsedEnv.NODE_ENV === "development",
};
