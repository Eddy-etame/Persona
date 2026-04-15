import { useState, useEffect, useRef, useCallback } from "react";

export type AutosaveStatus = "saved" | "saving" | "unsaved";

export function useAutosave<T>(key: string, data: T, delay = 500) {
  const [status, setStatus] = useState<AutosaveStatus>("saved");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialRef = useRef(true);
  const lastSavedRef = useRef<string>("");

  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
      lastSavedRef.current = JSON.stringify(data);
      return;
    }

    const serialized = JSON.stringify(data);
    if (serialized === lastSavedRef.current) return;

    setStatus("unsaved");

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      localStorage.setItem(key, serialized);
      lastSavedRef.current = serialized;
      setStatus("saving");
      setTimeout(() => setStatus("saved"), 300);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [key, data, delay]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (status === "unsaved") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [status]);

  const forceSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    lastSavedRef.current = serialized;
    setStatus("saved");
  }, [key, data]);

  return { status, forceSave };
}
