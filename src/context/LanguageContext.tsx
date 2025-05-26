import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

// Define types and interfaces
export type Translations = Record<string, string | Record<string, string>>; // Allow nested translations

export interface LanguageContextType {
  language: string;
  translations: Translations;
  setLanguage: (lang: string) => void;
  translate: (key: string, defaultText?: string) => string;
}

// Create LanguageContext
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en'); // Default to 'en', will be updated
  const [translations, setTranslations] = useState<Translations>({});
  const [isUserLanguageLoaded, setIsUserLanguageLoaded] = useState(false); // Flag to prevent race conditions

  // Effect to load user's language preference from profile or localStorage
  useEffect(() => {
    const initializeLanguage = async () => {
      let initialLanguage = 'en'; // Default

      // 1. Try to get language from authenticated user's profile
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('language')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile for language preference:', error);
          } else if (profile?.language) {
            initialLanguage = profile.language;
            console.log(`Language loaded from user profile: ${initialLanguage}`);
          }
        } catch (profileError) {
          console.error('Exception fetching user profile for language:', profileError);
        }
      }

      // 2. If no profile language, try localStorage (only if profile wasn't found or no session)
      if (initialLanguage === 'en' || !session?.user) { // Check if profile didn't set it or no user
          if (typeof window !== 'undefined') {
            const storedLanguage = localStorage.getItem('language');
            if (storedLanguage) {
              initialLanguage = storedLanguage;
              console.log(`Language loaded from localStorage: ${initialLanguage}`);
            }
          }
      }
      
      setLanguageState(initialLanguage);
      setIsUserLanguageLoaded(true); // Mark as loaded
    };

    initializeLanguage();
  }, []);


  // Effect to load translations when language changes AND user language has been initially loaded
  useEffect(() => {
    if (!isUserLanguageLoaded) return; // Don't load translations until initial language is set

    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../i18n/${language}.json`);
        setTranslations(translationModule.default || translationModule);
      } catch (error) {
        console.error(`Could not load translations for language: ${language}`, error);
        // Fallback to English if the selected language fails to load
        if (language !== 'en') {
          try {
            const fallbackModule = await import(`../i18n/en.json`);
            setTranslations(fallbackModule.default || fallbackModule);
            // Optionally set language to 'en' if current language files are missing
            // setLanguageState('en'); 
            console.warn(`Fell back to 'en' translations.`);
          } catch (fallbackError) {
            console.error('Could not load fallback English translations.', fallbackError);
            setTranslations({}); // Set to empty if even English fails
          }
        } else {
          setTranslations({}); // Set to empty if English itself fails
        }
      }
    };

    loadTranslations();
  }, [language, isUserLanguageLoaded]); // Depend on isUserLanguageLoaded

  // Effect to update localStorage and user profile when language changes
  useEffect(() => {
    if (!isUserLanguageLoaded) return; // Don't persist until initial language is set and has changed

    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      console.log(`Language saved to localStorage: ${language}`);
    }

    const updateUserProfileLanguage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ language: language })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating user language in profile:', error);
          } else {
            console.log(`User profile language updated to: ${language}`);
          }
        } catch (updateError) {
          console.error('Exception updating user profile language:', updateError);
        }
      }
    };

    updateUserProfileLanguage();
  }, [language, isUserLanguageLoaded]); // Also depend on isUserLanguageLoaded to ensure it runs after init

  // Function to update language - this is what components will call
  const setLanguage = (lang: string) => {
    setLanguageState(lang); // This will trigger the useEffect above to persist the change
  };

  // Basic translation function
  const translate = (key: string, defaultText: string = key): string => {
    const keys = key.split('.');
    let current: string | Translations = translations;

    for (const k of keys) {
      if (typeof current === 'object' && current !== null && k in current) {
        current = (current as Translations)[k];
      } else {
        return defaultText; // Key not found, return default text or the key itself
      }
    }
    return typeof current === 'string' ? current : defaultText;
  };


  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the LanguageContext (optional, but good practice)
// export const useLanguage = (): LanguageContextType => {
//   const context = useContext(LanguageContext);
//   if (context === undefined) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// };
