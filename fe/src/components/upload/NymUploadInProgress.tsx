import { LoadingLottie } from "@/components/lotties/LoadingLottie";
import TransitionWrapper from "@/components/animation/TransitionWrapper";

const NymUploadInProgress: React.FC = () => {
  return (
    <TransitionWrapper>
      <LoadingLottie />
    </TransitionWrapper>
  );
};

export default NymUploadInProgress;
