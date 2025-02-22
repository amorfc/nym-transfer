import NymButton from "@/components/common/NymButton";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import NymText from "@/components/common/NymText";
import { FireWorksLottie } from "@/components/lotties/FireWorksLottie";
import { LoadingLottie } from "@/components/lotties/LoadingLottie";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ROUTES } from "@/routes/ROUTES";
import {
  useDownloadFileMutation,
  useGetFileInfoQuery,
} from "@/store/api/nymApi";
import {
  downloadFileToLocal,
  formatKilobytesToHuman,
  formatTimestamp,
} from "@/utils/fileUtils";
import { Layout } from "antd";
import { useCallback, useState } from "react";
import { Navigate, useParams } from "react-router";
import { truncateMiddle } from "@/utils/stringUtils";

const DownloadRoute = () => {
  console.log(useParams());

  const params = useParams();
  const path = params["*"] ?? "";

  const [downloadFile] = useDownloadFileMutation();
  const { isNymClientReady } = useNymClientStatus();
  const { data: fileInfo, isLoading: isLoadingInfo } = useGetFileInfoQuery(
    {
      payload: { path },
    },
    {
      skip: !path || !isNymClientReady,
    }
  );

  const {
    title: fileTitle = "UnknownTitle",
    sizeInKilobytes,
    uploadTimestamp,
  } = fileInfo || {};
  const colors = useThemeColors();
  const { goToUpload } = useAppNavigation();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);
      const { content } = await downloadFile({
        payload: { path },
      }).unwrap();

      if (content) {
        downloadFileToLocal(content, fileTitle);
        setIsDownloaded(true);
      }
    } catch (err) {
      setError("Failed to download file. Please try again.");
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [downloadFile, fileTitle, path]);

  // Validate URL parameters
  if (!path) {
    console.error("Invalid parameters:", { path });
    return <Navigate to={ROUTES.UPLOAD} replace />;
  }

  // Show loading state while fetching file info
  if (isLoadingInfo) {
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
          <NymText>Fetching file information...</NymText>
        </NymFlexContainer>
      </Layout>
    );
  }

  // Show file info and download button
  if (fileInfo && !isDownloaded && !isDownloading) {
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <NymText>Title: {fileTitle}</NymText>
            <NymText>
              Size: {formatKilobytesToHuman(sizeInKilobytes || 0)}
            </NymText>
            <NymText>
              Uploaded: {formatTimestamp(uploadTimestamp || "")}
            </NymText>
            {fileInfo.message && <NymText>Message: {fileInfo.message}</NymText>}
          </div>
          <NymButton onClick={handleDownload}>Download File</NymButton>
          <NymButton onClick={() => goToUpload()}>Go Back</NymButton>
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
  if (isDownloading) {
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
          <NymText>
            <NymText color={colors.primary} weight="bold">
              {truncateMiddle(fileTitle)}
            </NymText>{" "}
            Successfully Downloaded
          </NymText>
          <NymButton onClick={() => goToUpload()}>Send New File</NymButton>
        </div>
      </Layout>
    );
  }

  return null;
};

export default DownloadRoute;
