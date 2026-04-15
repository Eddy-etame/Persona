import { Suspense } from "react";
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./lib/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Chargement...</div>}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}
