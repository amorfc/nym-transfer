import NymButton from "@/components/common/NymButton";
import NymText from "@/components/common/NymText";
import { FireWorksLottie } from "@/components/lotties/FireWorksLottie";
import { useThemeColors } from "@/hooks/useThemeColors";
import { truncateMiddle } from "@/utils/stringUtils";

type DownloadSuccessContentProps = {
  fileTitle: string;
  onGoBack: () => void;
};

const DownloadSuccessContent = ({
  fileTitle,
  onGoBack,
}: DownloadSuccessContentProps) => {
  const colors = useThemeColors();

  return (
    <>
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
        <NymButton onClick={onGoBack}>Send New File</NymButton>
      </div>
    </>
  );
};

export default DownloadSuccessContent;
