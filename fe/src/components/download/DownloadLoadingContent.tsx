import NymText from "@/components/common/NymText";
import { LoadingLottie } from "@/components/lotties/LoadingLottie";

type DownloadLoadingContentProps = {
  message: string;
};

const DownloadLoadingContent = ({ message }: DownloadLoadingContentProps) => (
  <>
    <LoadingLottie />
    <NymText>{message}</NymText>
  </>
);

export default DownloadLoadingContent;
