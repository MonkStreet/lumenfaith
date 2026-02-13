import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import {
  getLocale,
  setLocaleStorage,
  getTranslations,
  getChildMode,
  setChildModeStorage,
  tKey,
  LOCALES,
} from "./translations";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getLocale);
  const [childMode, setChildModeState] = useState(getChildMode);

  const setLocale = useCallback((next) => {
    if (next !== LOCALES.EN_US && next !== LOCALES.ES_ES) return;
    setLocaleStorage(next);
    setLocaleState(next);
  }, []);

  const setChildMode = useCallback((on) => {
    const val = !!on;
    setChildModeStorage(val);
    setChildModeState(val);
  }, []);

  const translations = useMemo(() => getTranslations(locale, childMode), [locale, childMode]);

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
    () => ({ locale, setLocale, t, translations, LOCALES, childMode, setChildMode }),
    [locale, setLocale, t, translations, childMode, setChildMode]
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
