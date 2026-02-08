import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import {
  getLocale,
  setLocaleStorage,
  getTranslations,
  tKey,
  LOCALES,
} from "./translations";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getLocale);

  const setLocale = useCallback((next) => {
    if (next !== LOCALES.EN_US && next !== LOCALES.ES_ES) return;
    setLocaleStorage(next);
    setLocaleState(next);
  }, []);

  const translations = useMemo(() => getTranslations(locale), [locale]);

  const t = useCallback(
    (key, params = {}) => tKey(translations, key, params),
    [translations]
  );

  useEffect(() => {
    document.documentElement.lang = locale === LOCALES.ES_ES ? "es" : "en";
    const title = translations?.home?.documentTitle;
    if (title) document.title = title;
  }, [locale, translations]);

  const value = useMemo(
    () => ({ locale, setLocale, t, translations, LOCALES }),
    [locale, setLocale, t, translations]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
