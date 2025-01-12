import NymButton from "@/components/common/NymButton";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import NymText from "@/components/common/NymText";
import { FireWorksLottie } from "@/components/lotties/FireWorksLottie";
import { LoadingLottie } from "@/components/lotties/LoadingLottie";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";
import { ROUTES } from "@/routes/ROUTES";
import { useDownloadFileMutation } from "@/store/api/nymApi";
import { downloadFileToLocal } from "@/utils/fileUtils";
import { Layout } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";

const DownloadRoute = () => {
  const { fileId, name } = useParams();
  const [downloadFile, { isLoading }] = useDownloadFileMutation();
  const { isNymClientReady } = useNymClientStatus();
  const { goToUpload } = useAppNavigation();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    try {
      const { content } = await downloadFile({
        payload: {
          path: `${fileId}/${name}`,
        },
      }).unwrap();

      if (content && name) {
        downloadFileToLocal(content, name);
        setIsDownloaded(true);
      }
    } catch (err) {
      setError("Failed to download file. Please try again.");
      console.error("Download error:", err);
    }
  }, [downloadFile, fileId, name]);

  useEffect(() => {
    if (isNymClientReady && !isDownloaded && !error) {
      handleDownload();
    }
  }, [isNymClientReady, handleDownload, isDownloaded, error]);

  // Validate URL parameters
  if (!fileId || fileId.startsWith(":") || !name || name.startsWith(":")) {
    console.error("Invalid parameters:", { fileId, name });
    return <Navigate to={ROUTES.UPLOAD} replace />;
  }

  // Show loading state while connecting to WebSocket
  if (!isNymClientReady) {
    return (
      <Layout style={{ background: "transparent" }}>
        <NymFlexContainer
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingLottie />
          <NymText>Connecting to Nym network...</NymText>
        </NymFlexContainer>
      </Layout>
    );
  }

  // Show error state if download failed
  if (error) {
    return (
      <Layout style={{ background: "transparent" }}>
        <NymFlexContainer
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <NymText type="danger">{error}</NymText>
          <NymButton onClick={handleDownload}>Retry Download</NymButton>
          <NymButton onClick={() => goToUpload()}>Go Back</NymButton>
        </NymFlexContainer>
      </Layout>
    );
  }

  // Show loading state while downloading
  if (isLoading) {
    return (
      <Layout style={{ background: "transparent" }}>
        <NymFlexContainer
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <LoadingLottie />
          <NymText>Downloading your file...</NymText>
        </NymFlexContainer>
      </Layout>
    );
  }

  // Show success state after download
  if (isDownloaded) {
    return (
      <Layout style={{ background: "transparent" }}>
        <FireWorksLottie />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <NymText>{name} Successfully Downloaded</NymText>
          <NymButton onClick={() => goToUpload()}>Send New File</NymButton>
        </div>
      </Layout>
    );
  }

  return null;
};

export default DownloadRoute;
