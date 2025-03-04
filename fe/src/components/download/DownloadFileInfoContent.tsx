import NymButton from "@/components/common/NymButton";
import { FileInfoResponseData } from "@/service/response/FileInfoMixnetResponse";
import { Flex } from "antd";
import FileInfoCard from "@/components/common/FileInfoCard";

type DownloadFileInfoContentProps = {
  fileInfo: FileInfoResponseData;
  onDownload: () => void;
  onGoBack: () => void;
};

const DownloadFileInfoContent = ({
  fileInfo,
  onDownload,
  onGoBack,
}: DownloadFileInfoContentProps) => {
  return (
    <Flex vertical gap="large" style={{ width: "100%" }}>
      <FileInfoCard fileInfo={fileInfo} />
      <Flex vertical gap="small">
        <NymButton onClick={onDownload}>Download File</NymButton>
        <NymButton onClick={onGoBack}>Go Back</NymButton>
      </Flex>
    </Flex>
  );
};

export default DownloadFileInfoContent;
