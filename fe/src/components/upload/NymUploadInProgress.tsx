import { LoadingLottie } from "@/components/lotties/LoadingLottie";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import NymDisclaimer from "@/components/common/NymDisclaimer";
import NymText from "@/components/common/NymText";
import { useThemeColors } from "@/hooks/useThemeColors";

const NymUploadInProgress: React.FC = () => {
  const colors = useThemeColors();
  return (
    <TransitionWrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <LoadingLottie />
        <NymText>Uploading your file...</NymText>
        <NymDisclaimer>
          This app uses the <NymText color={colors.primary}>Nym Mixnet</NymText>{" "}
          for enhanced privacy, which may take longer to process, even for small
          files. Please keep the page open until you receive your download link.
        </NymDisclaimer>
      </div>
    </TransitionWrapper>
  );
};

export default NymUploadInProgress;
