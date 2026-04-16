import { Suspense, useEffect, useState } from "react";
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./lib/ThemeProvider";
import { Preface } from "./components/Preface";

export default function App() {
  const [showPreface, setShowPreface] = useState(false);

  useEffect(() => {
    try {
      const already = sessionStorage.getItem("edu-preface-shown");
      if (!already) {
        setShowPreface(true);
      }
    } catch {
      // If sessionStorage is unavailable, skip the preface.
    }
  }, []);

  return (
    <ThemeProvider>
      {showPreface ? (
        <Preface
          onDone={() => {
            try {
              sessionStorage.setItem("edu-preface-shown", "1");
            } catch {}
            setShowPreface(false);
          }}
        />
      ) : (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Chargement...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      )}
      <Toaster />
    </ThemeProvider>
  );
}
