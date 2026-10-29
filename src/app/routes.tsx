import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/Root";
import { DayPage } from "./components/DayPage";

// Paths from earlier versions of the site, pointed at the Poster that now holds their content.
const legacyPaths: Record<string, string> = {
  about: "sunrise",
  education: "dusk",
  experience: "midday",
  playlist: "midday",
  projects: "afternoon",
  contact: "twilight",
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: DayPage },
      ...Object.entries(legacyPaths).map(([path, slot]) => ({
        path,
        element: <Navigate to={`/#${slot}`} replace />,
      })),
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
