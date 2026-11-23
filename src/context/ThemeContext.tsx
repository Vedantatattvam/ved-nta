import React, { createContext, useContext, useEffect } from "react";

export type AppTheme = "golden_ivory";

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  isScholarDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-golden-ivory");
    root.classList.remove("theme-classic-scholar");
    document.body.classList.remove("dark-scholar");
    try {
      localStorage.removeItem("vedantatattvam_app_theme_v1");
    } catch {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: "golden_ivory",
        setTheme: () => {},
        toggleTheme: () => {},
        isScholarDark: false,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

