import React, { createContext, useContext, useState, useEffect } from "react";
import { resources, LanguageCode } from "../i18n";

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  // Load language from localStorage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem("ai_tender_language");
    if (saved && ["en", "hi", "mr"].includes(saved as LanguageCode)) {
      setLanguageState(saved as LanguageCode);
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ai_tender_language", language);
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  // Simple translation function
  const t = (key: string): string => {
    const keys = key.split(".");
    let res: any = resources[language]?.translation;

    for (const k of keys) {
      if (res && typeof res === "object" && k in res) {
        res = res[k];
      } else {
        // Fallback to English if key not found in current language
        if (language !== "en") {
          res = resources.en.translation;
          for (const k2 of keys) {
            if (res && typeof res === "object" && k2 in res) {
              res = res[k2];
            } else {
              // If still not found, return the key itself as a fallback
              return key;
            }
          }
          return res;
        }
        // If English also doesn't have it, return the key
        return key;
      }
    }
    return res || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};