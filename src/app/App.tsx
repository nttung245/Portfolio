import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { DayPage } from "./components/DayPage";

export default function App() {
  return (
    // Only motion's animation features load: nothing here uses its layout engine or gestures.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <DayPage />
      </MotionConfig>
    </LazyMotion>
  );
}
