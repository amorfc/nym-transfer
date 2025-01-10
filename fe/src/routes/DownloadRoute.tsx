import { LoadingLottie } from "@/components/lotties/LoadingLottie";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";
import { useDownloadFileMutation } from "@/store/api/nymApi";
import { downloadFileToLocal } from "@/utils/fileUtils";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router";

const DownloadRoute = () => {
  // Extract parameters from the URL
  const { fileId, name } = useParams();
  const [downloadFile, { isLoading, isUninitialized }] =
    useDownloadFileMutation();
  const { isNymClientReady } = useNymClientStatus();

  const handleDownload = useCallback(async () => {
    const { content } = await downloadFile({
      payload: {
        path: `${fileId ?? ""}/${name ?? ""}`,
      },
    }).unwrap();

    if (content) {
      downloadFileToLocal(content, name ?? "Nym File");
    }
  }, [downloadFile, fileId, name]);

  useEffect(() => {
    const download = async () => {
      if (isUninitialized && fileId && name) {
        await handleDownload();
      }
    };

    if (isNymClientReady) {
      download();
    }
  }, [isUninitialized, fileId, name, handleDownload, isNymClientReady]);

  if (isLoading) {
    return <LoadingLottie />;
  }
  return <div>DownloadRoute + downloaded file {name}</div>;
};

export default DownloadRoute;
