import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "wg-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(KEY)) as Theme | null;
    const initial: Theme = stored ?? "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(KEY, next);
  };

  return { theme, toggle };
}

export type Role = "admin" | "driver" | "traveler";
const ROLE_KEY = "wg-role";

export function useRole() {
  const [role, setRoleState] = useState<Role>("traveler");
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(ROLE_KEY)) as Role | null;
    if (stored) setRoleState(stored);
  }, []);
  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem(ROLE_KEY, r);
  };
  return { role, setRole };
}
