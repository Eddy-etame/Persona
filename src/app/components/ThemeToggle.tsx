import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../lib/ThemeProvider";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button variant="ghost" size="icon" onClick={next} className="w-8 h-8" title={`Thème: ${theme}`}>
      {theme === "light" && <Sun className="w-4 h-4" />}
      {theme === "dark" && <Moon className="w-4 h-4" />}
      {theme === "system" && <Monitor className="w-4 h-4" />}
    </Button>
  );
}
