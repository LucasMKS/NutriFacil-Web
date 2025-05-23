"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTheme, setTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const initial = getTheme();
    setThemeState(initial);
    setTheme(initial); // garante a classe certa
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setThemeState(newTheme);
  }

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      size="icon"
      aria-label="Trocar tema"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
      <span className="sr-only">Trocar tema</span>
    </Button>
  );
}
