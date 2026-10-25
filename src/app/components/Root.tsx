import { Outlet } from "react-router";
import { MotionConfig } from "motion/react";

export function Root() {
  return (
    <MotionConfig reducedMotion="user">
      <Outlet />
    </MotionConfig>
  );
}
