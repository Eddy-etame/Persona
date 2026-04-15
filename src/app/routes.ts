import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import { SchoolSelection } from "./pages/SchoolSelection";
import { SchoolOnboarding } from "./pages/SchoolOnboarding";
import { HomePage } from "./pages/HomePage";
import { PersonaEditor } from "./pages/PersonaEditor";
import { JourneyMapEditor } from "./pages/JourneyMapEditor";

const PosterView = lazy(() =>
  import("./pages/PosterView").then((m) => ({ default: m.PosterView }))
);
const ComparePersonas = lazy(() =>
  import("./pages/ComparePersonas").then((m) => ({ default: m.ComparePersonas }))
);
const PresentationMode = lazy(() =>
  import("./pages/PresentationMode").then((m) => ({ default: m.PresentationMode }))
);
const Analytics = lazy(() =>
  import("./pages/Analytics").then((m) => ({ default: m.Analytics }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SchoolSelection,
  },
  {
    path: "/school-setup",
    Component: SchoolOnboarding,
  },
  {
    path: "/home",
    Component: HomePage,
  },
  {
    path: "/persona",
    Component: PersonaEditor,
  },
  {
    path: "/journey-map",
    Component: JourneyMapEditor,
  },
  {
    path: "/poster",
    Component: PosterView,
  },
  {
    path: "/compare",
    Component: ComparePersonas,
  },
  {
    path: "/present",
    Component: PresentationMode,
  },
  {
    path: "/analytics",
    Component: Analytics,
  },
]);
