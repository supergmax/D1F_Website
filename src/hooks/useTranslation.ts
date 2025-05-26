import { useContext } from 'react';
import { LanguageContext, LanguageContextType } from '../context/LanguageContext';

/**
 * Custom hook to access translation functions and language state.
 * 
 * This hook must be used within a component that is a descendant of `LanguageProvider`.
 * 
 * @returns {object} An object containing:
 *  - `t`: The translation function. (alias for `translate` from context)
 *  - `language`: The current active language code (e.g., 'en', 'fr').
 *  - `setLanguage`: Function to change the active language.
 * @throws {Error} If used outside of a `LanguageProvider`.
 */
export const useTranslation = () => {
  const context = useContext<LanguageContextType | undefined>(LanguageContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  return {
    t: context.translate,
    language: context.language,
    setLanguage: context.setLanguage,
  };
};
