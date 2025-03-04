import NymButton from "@/components/common/NymButton";
import NymText from "@/components/common/NymText";

type DownloadErrorContentProps = {
  error: string;
  onRetry: () => void;
  onGoBack: () => void;
};

const DownloadErrorContent = ({
  error,
  onRetry,
  onGoBack,
}: DownloadErrorContentProps) => (
  <>
    <NymText type="danger">{error}</NymText>
    <NymButton onClick={onRetry}>Retry Download</NymButton>
    <NymButton onClick={onGoBack}>Go Back</NymButton>
  </>
);

export default DownloadErrorContent;
