import NymButton from "@/components/common/NymButton";
import NymText from "@/components/common/NymText";
import { FileInfoResponseData } from "@/service/response/FileInfoMixnetResponse";
import { formatKilobytesToHuman, formatTimestamp } from "@/utils/fileUtils";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { MouseEvent } from "react";

type DownloadFileInfoContentProps = {
  fileInfo: FileInfoResponseData;
  onDownload: () => void;
};

const DownloadFileInfoContent = ({
  fileInfo,
  onDownload,
}: DownloadFileInfoContentProps) => {
  const { goToUpload } = useAppNavigation();

  const {
    title = "Unknown File",
    sizeInKilobytes = 0,
    uploadTimestamp = "",
    message,
  } = fileInfo || {};

  const handleGoBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    goToUpload();
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <NymText>Title: {title}</NymText>
        <NymText>Size: {formatKilobytesToHuman(sizeInKilobytes)}</NymText>
        <NymText>Uploaded: {formatTimestamp(uploadTimestamp)}</NymText>
        {message && <NymText>Message: {message}</NymText>}
      </div>
      <NymButton onClick={onDownload}>Download File</NymButton>
      <NymButton onClick={handleGoBack}>Go Back</NymButton>
    </>
  );
};

export default DownloadFileInfoContent;
