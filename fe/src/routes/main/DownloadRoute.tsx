import { Flex, Layout } from "antd";
import { Navigate, useParams } from "react-router";

import DownloadErrorContent from "@/components/download/DownloadErrorContent";
import DownloadFileInfoContent from "@/components/download/DownloadFileInfoContent";
import DownloadLoadingContent from "@/components/download/DownloadLoadingContent";
import DownloadSuccessContent from "@/components/download/DownloadSuccessContent";

import { ROUTES } from "@/routes/ROUTES";
import { useFileDownload } from "@/hooks/file/useFileDownload";

const DownloadRoute = () => {
  const params = useParams();
  const path = params["*"] ?? "";

  const {
    fileInfo,
    isLoading,
    isError,
    handleDownload,
    downloadState,
    goToUpload,
  } = useFileDownload(path);

  const renderContent = () => {
    if (isLoading) {
      return <DownloadLoadingContent message="Fetching file information..." />;
    }

    if (isError) {
      return (
        <DownloadErrorContent
          error={downloadState.error || "Failed to fetch file information"}
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
          onGoBack={goToUpload}
        />
      );
    }

    // If fetch has been attempted but no file info, show error
    if (downloadState.hasAttemptedFetch && !downloadState.path) {
      return <Navigate to={ROUTES.UPLOAD} replace />;
    }

    return (
      <DownloadErrorContent
        error="No file information available"
        onRetry={handleDownload}
        onGoBack={goToUpload}
      />
    );
  };

  return (
    <Layout style={{ background: "transparent" }}>
      <Flex vertical style={{ width: "100%" }}>
        {renderContent()}
      </Flex>
    </Layout>
  );
};

export default DownloadRoute;
