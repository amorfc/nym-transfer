import { z } from "zod";

// Define a custom function to parse a JSON-like string into an array of numbers
function parseArrayStringToNumber(value: string): number[] {
  try {
    const parsed = JSON.parse(value);
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "number")
    ) {
      return parsed;
    }
    throw new Error("Invalid format for NYM_CLIENT_ADDRESS_BYTE_ARR");
  } catch (error) {
    throw new Error(
      `Failed to parse NYM_CLIENT_ADDRESS_BYTE_ARR as an array of numbers ${error}`
    );
  }
}

// Define the schema with a custom transformation
const envSchema = z.object({
  VITE_DOMAIN_BASE_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  NYM_CLIENT_ADDRESS_BYTE_ARR: z
    .string()
    .transform((value) => parseArrayStringToNumber(value)), // Use the custom transformation
});

// Parse and validate the environment variables
const parsedEnv = envSchema.parse({
  VITE_DOMAIN_BASE_URL: import.meta.env.VITE_DOMAIN_BASE_URL,
  NODE_ENV: import.meta.env.MODE,
  NYM_CLIENT_ADDRESS_BYTE_ARR: import.meta.env.VITE_NYM_CLIENT_ADDRESS_BYTE_ARR,
});

// Expose validated and parsed environment variables
export const Env = {
  DOMAIN_BASE_URL: parsedEnv.VITE_DOMAIN_BASE_URL,
  NYM_CLIENT_ADDRESS_BYTE_ARR: parsedEnv.NYM_CLIENT_ADDRESS_BYTE_ARR, // Now an array of numbers
  IS_DEV: parsedEnv.NODE_ENV === "development",
};
