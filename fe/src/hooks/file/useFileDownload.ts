import { useState, useCallback } from "react";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";
import {
  useDownloadFileMutation,
  useGetFileInfoQuery,
} from "@/store/api/nymApi";
import { downloadFileToLocal } from "@/utils/fileUtils";

export const useFileDownload = (initialPath: string) => {
  const { goToUpload } = useAppNavigation();
  const { isNymClientReady } = useNymClientStatus();

  const [downloadState, setDownloadState] = useState({
    path: initialPath,
    isLoading: false,
    isDownloading: false,
    isDownloaded: false,
    error: null as string | null,
  });

  const { data: fileInfo, isLoading } = useGetFileInfoQuery(
    { payload: { path: downloadState.path } },
    {
      skip: !downloadState.path || !isNymClientReady,
    }
  );

  const [downloadFile] = useDownloadFileMutation();

  const handleDownload = useCallback(async () => {
    if (!fileInfo) return;

    try {
      setDownloadState((prev) => ({
        ...prev,
        isDownloading: true,
        error: null,
      }));

      const { content } = await downloadFile({
        payload: { path: downloadState.path },
      }).unwrap();

      if (content) {
        downloadFileToLocal(content, fileInfo.title);
        setDownloadState((prev) => ({
          ...prev,
          isDownloading: false,
          isDownloaded: true,
        }));
      }
    } catch (err) {
      setDownloadState((prev) => ({
        ...prev,
        isDownloading: false,
        error: "Failed to download file. Please try again.",
      }));
      console.error("Download error:", err);
    }
  }, [downloadFile, fileInfo, downloadState.path]);

  return {
    fileInfo,
    isLoading,
    handleDownload,
    downloadState,
    goToUpload,
  };
};
