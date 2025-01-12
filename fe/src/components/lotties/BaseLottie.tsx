import TransitionWrapper from "@/components/animation/TransitionWrapper";
import React, { useMemo } from "react";
import Lottie from "react-lottie";

interface BaseLottieProps {
  animationData: object; // Lottie animation data
  height?: number; // Optional height
  width?: number; // Optional width
  loop?: boolean; // Should the animation loop
  autoplay?: boolean; // Should the animation autoplay
}

const BaseLottie: React.FC<BaseLottieProps> = ({
  animationData,
  height = 100,
  width = 100,
  loop = true,
  autoplay = true,
}) => {
  // Memoize options to avoid re-creation on each render
  const defaultOptions = useMemo(
    () => ({
      loop,
      autoplay,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    }),
    [loop, autoplay, animationData]
  );

  return (
    <TransitionWrapper>
      <Lottie options={defaultOptions} height={height} width={width} />
    </TransitionWrapper>
  );
};

export default BaseLottie;
