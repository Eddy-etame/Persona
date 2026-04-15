import { createBrowserRouter } from "react-router";
import { SchoolSelection } from "./pages/SchoolSelection";
import { SchoolOnboarding } from "./pages/SchoolOnboarding";
import { HomePage } from "./pages/HomePage";
import { PersonaEditor } from "./pages/PersonaEditor";
import { JourneyMapEditor } from "./pages/JourneyMapEditor";
import { PosterView } from "./pages/PosterView";
import { ComparePersonas } from "./pages/ComparePersonas";

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
]);
