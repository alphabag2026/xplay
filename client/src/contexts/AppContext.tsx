import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Lang, getDefaultLang, T } from "@/lib/i18n";

interface AppContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  referralLink: string;
  setReferralLink: (link: string) => void;
  ctaLink: string;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_CTA = "https://app.xplaybot.com/";

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getDefaultLang);
  const [referralLink, setReferralLinkState] = useState<string>(() => {
    return localStorage.getItem("xplay_referral") || "";
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", l);
    window.history.replaceState({}, "", url.toString());
  }, []);

  const setReferralLink = useCallback((link: string) => {
    setReferralLinkState(link);
    if (link) {
      localStorage.setItem("xplay_referral", link);
    } else {
      localStorage.removeItem("xplay_referral");
    }
  }, []);

  // Also check URL for referral
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && !referralLink) {
      setReferralLink(ref);
    }
  }, []);

  const ctaLink = referralLink || DEFAULT_CTA;

  const t = useCallback(
    (key: string) => {
      const entry = T[key];
      if (!entry) return key;
      return entry[lang] || entry["en"] || key;
    },
    [lang],
  );

  return (
    <AppContext.Provider value={{ lang, setLang, t, referralLink, setReferralLink, ctaLink }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
