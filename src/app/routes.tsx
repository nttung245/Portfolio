import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/Root";
import { PortfolioPage } from "./components/PortfolioPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: PortfolioPage },
      { path: "about", element: <Navigate to="/#about" replace /> },
      { path: "education", element: <Navigate to="/#education" replace /> },
      { path: "experience", element: <Navigate to="/#experience" replace /> },
      { path: "playlist", element: <Navigate to="/#experience" replace /> },
      { path: "projects", element: <Navigate to="/#experience" replace /> },
      { path: "contact", element: <Navigate to="/#contact" replace /> },
    ],
  },
]);
