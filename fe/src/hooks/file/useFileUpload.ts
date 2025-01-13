// hooks/useFileUpload.ts
import { useState } from "react";

interface UseFileUploadOptions {
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const validateFile = (file: File): boolean => {
    // Size validation (default 100MB)
    const maxSize = (options.maxSize ?? 100) * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File size cannot exceed ${options.maxSize ?? 10}MB`);
    }

    // Type validation
    if (options.allowedTypes?.length) {
      if (!options.allowedTypes.includes(file.type)) {
        throw new Error(
          `File type must be: ${options.allowedTypes.join(", ")}`
        );
      }
    }

    return true;
  };

  return { file, setFile, loading, setLoading, validateFile };
};
