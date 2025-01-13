import TransitionWrapper from "@/components/animation/TransitionWrapper";
import React from "react";
import Lottie from "react-lottie-player";

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
  return (
    <TransitionWrapper>
      <Lottie
        animationData={animationData}
        loop={loop}
        play={autoplay}
        style={{ height, width }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
      />
    </TransitionWrapper>
  );
};

export default BaseLottie;
