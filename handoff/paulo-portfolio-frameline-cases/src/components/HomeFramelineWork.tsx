import { homeFramelineProjects } from "@/src/content/frameline-showcase";
import { FrameWorkGrid } from "./FrameWorkGrid";

export function HomeFramelineWork() {
  return (
    <FrameWorkGrid
      label="Frameline surfaces"
      kicker="Frameline — design-engineering surfaces shipped in code"
      projects={homeFramelineProjects}
    />
  );
}
