import { Layout } from "antd";
import { Navigate, useParams } from "react-router";

import NymFlexContainer from "@/components/common/NymFlexContainer";
import DownloadErrorContent from "@/components/download/DownloadErrorContent";
import DownloadFileInfoContent from "@/components/download/DownloadFileInfoContent";
import DownloadLoadingContent from "@/components/download/DownloadLoadingContent";
import DownloadSuccessContent from "@/components/download/DownloadSuccessContent";

import { ROUTES } from "@/routes/ROUTES";
import { useFileDownload } from "@/hooks/file/useFileDownload";

const DownloadRoute = () => {
  const params = useParams();
  const path = params["*"] ?? "";

  const { fileInfo, isLoading, handleDownload, downloadState, goToUpload } =
    useFileDownload(path);

  const renderContent = () => {
    if (!downloadState.path) {
      return <Navigate to={ROUTES.UPLOAD} replace />;
    }

    if (isLoading) {
      return <DownloadLoadingContent message="Fetching file information..." />;
    }

    if (downloadState.error) {
      return (
        <DownloadErrorContent
          error={downloadState.error}
          onRetry={handleDownload}
          onGoBack={goToUpload}
        />
      );
    }

    if (downloadState.isDownloading) {
      return <DownloadLoadingContent message="Downloading your file..." />;
    }

    if (downloadState.isDownloaded) {
      return (
        <DownloadSuccessContent
          fileTitle={fileInfo?.title || "Unknown File"}
          onGoBack={goToUpload}
        />
      );
    }

    if (fileInfo) {
      return (
        <DownloadFileInfoContent
          fileInfo={fileInfo}
          onDownload={handleDownload}
        />
      );
    }

    return <Navigate to={ROUTES.UPLOAD} replace />;
  };

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
        {renderContent()}
      </NymFlexContainer>
    </Layout>
  );
};

export default DownloadRoute;
