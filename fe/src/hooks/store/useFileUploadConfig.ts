import {
  selectMaxFileCount,
  selectMultipleFiles,
} from "@/store/slices/appSlice";
import { useAppSelector } from "@/hooks/useAppStore";

export const useFileUploadConfig = () => {
  const maxFileCount = useAppSelector(selectMaxFileCount);
  const multipleFiles = useAppSelector(selectMultipleFiles);

  return { maxFileCount, multipleFiles };
};
