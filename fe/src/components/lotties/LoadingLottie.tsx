import TransitionWrapper from "@/components/animation/TransitionWrapper";
import Lottie from "react-lottie";
import animationData from "@/assets/lotties/loading.json";

export const LoadingLottie = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <TransitionWrapper>
      <Lottie options={defaultOptions} height={200} width={200} />
    </TransitionWrapper>
  );
};
