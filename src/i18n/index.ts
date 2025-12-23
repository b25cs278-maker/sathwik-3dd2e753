import { en } from "./translations/en";
import { hi } from "./translations/hi";
import { te } from "./translations/te";
import { ta } from "./translations/ta";
import { kn } from "./translations/kn";
import { ml } from "./translations/ml";
import { ur } from "./translations/ur";

export const translations = { en, hi, te, ta, kn, ml, ur };

export const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "ur", name: "Urdu", nativeName: "اردو", rtl: true },
] as const;

export type LanguageCode = typeof languages[number]["code"];
export type { TranslationKeys } from "./translations/en";
