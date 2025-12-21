import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Navbar
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',
    'nav.profile': 'My Profile',
    'nav.signOut': 'Sign Out',

    // Homepage
    'home.title': 'Physical AI & Humanoid Robotics',
    'home.subtitle': 'Master Embodied Intelligence. From ROS 2 Nervous Systems to Vision-Language-Action (VLA) Brains.',
    'home.exploreButton': 'Explore The BOOK 📖',
    'home.roadmapTitle': '13-Week Masterclass Roadmap',
    'home.hardwareTitle': 'Hardware Requirements Lab',
    'home.hardwareSubtitle': 'Don\'t just learn. Simulate with real-world power.',

    // Roadmap Cards
    'roadmap.nervousSystem': 'The Nervous System',
    'roadmap.nervousDesc': 'Weeks 1-5: ROS 2, URDF modeling, and state estimation.',
    'roadmap.digitalTwin': 'The Digital Twin',
    'roadmap.digitalDesc': 'Weeks 6-7: Physics-based simulation in Gazebo and Unity.',
    'roadmap.aiBrain': 'The AI Brain',
    'roadmap.aiDesc': 'Weeks 8-10: NVIDIA Isaac Sim, VSLAM, and Nav2.',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.signInTitle': 'Sign In to Continue',
    'auth.signUpTitle': 'Create Account',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.haveAccount': 'Already have an account?',

    // Profile
    'profile.title': 'My Profile',
    'profile.progress': 'Your Learning Progress',
    'profile.completion': 'Overall Completion',
    'profile.chapters': 'Chapters',

    // Chatbot
    'chat.welcome': 'Welcome! 👋',
    'chat.intro': 'I\'m your AI tutor for Physical AI & Robotics. Ask me anything about the chapters!',
    'chat.placeholder': 'Ask a question...',
    'chat.send': 'Send',
  },
  ur: {
    // Navbar
    'nav.signIn': 'سائن ان',
    'nav.signUp': 'سائن اپ',
    'nav.profile': 'میری پروفائل',
    'nav.signOut': 'سائن آؤٹ',

    // Homepage
    'home.title': 'فزیکل اے آئی اور ہیومنائیڈ روبوٹکس',
    'home.subtitle': 'مجسم انٹیلیجنس میں مہارت حاصل کریں۔ ROS 2 نرووس سسٹمز سے Vision-Language-Action (VLA) دماغ تک۔',
    'home.exploreButton': 'کتاب دیکھیں 📖',
    'home.roadmapTitle': '13 ہفتوں کا ماسٹر کلاس روڈ میپ',
    'home.hardwareTitle': 'ہارڈویئر کی ضروریات لیب',
    'home.hardwareSubtitle': 'صرف سیکھیں نہیں۔ حقیقی دنیا کی طاقت کے ساتھ نقل کریں۔',

    // Roadmap Cards
    'roadmap.nervousSystem': 'اعصابی نظام',
    'roadmap.nervousDesc': 'ہفتے 1-5: ROS 2، URDF ماڈلنگ، اور حالت کا تخمینہ۔',
    'roadmap.digitalTwin': 'ڈیجیٹل ٹوئن',
    'roadmap.digitalDesc': 'ہفتے 6-7: Gazebo اور Unity میں طبیعیات پر مبنی نقل۔',
    'roadmap.aiBrain': 'اے آئی دماغ',
    'roadmap.aiDesc': 'ہفتے 8-10: NVIDIA Isaac Sim، VSLAM، اور Nav2۔',

    // Auth
    'auth.email': 'ای میل',
    'auth.password': 'پاس ورڈ',
    'auth.name': 'پورا نام',
    'auth.signInTitle': 'جاری رکھنے کے لیے سائن ان کریں',
    'auth.signUpTitle': 'اکاؤنٹ بنائیں',
    'auth.forgotPassword': 'پاس ورڈ بھول گئے؟',
    'auth.noAccount': 'اکاؤنٹ نہیں ہے؟',
    'auth.haveAccount': 'پہلے سے اکاؤنٹ ہے؟',

    // Profile
    'profile.title': 'میری پروفائل',
    'profile.progress': 'آپ کی سیکھنے کی پیش رفت',
    'profile.completion': 'مجموعی تکمیل',
    'profile.chapters': 'ابواب',

    // Chatbot
    'chat.welcome': 'خوش آمدید! 👋',
    'chat.intro': 'میں فزیکل اے آئی اور روبوٹکس کے لیے آپ کا اے آئی ٹیوٹر ہوں۔ ابواب کے بارے میں کچھ بھی پوچھیں!',
    'chat.placeholder': 'سوال پوچھیں...',
    'chat.send': 'بھیجیں',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from URL or localStorage on mount
  useEffect(() => {
    // First, check URL for language (Docusaurus i18n routing)
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/ur/')) {
        setLanguageState('ur');
        localStorage.setItem('language', 'ur');
        return;
      }
    }

    // Fallback to localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ur')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Update document language attribute only (NOT direction - we'll handle that per-component)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;

      // Apply RTL class to book content only
      const bookContent = document.querySelector('.theme-doc-markdown, article, .markdown');
      if (bookContent) {
        if (lang === 'ur') {
          bookContent.setAttribute('dir', 'rtl');
          bookContent.classList.add('urdu-content');
        } else {
          bookContent.setAttribute('dir', 'ltr');
          bookContent.classList.remove('urdu-content');
        }
      }
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    // Set initial language attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;

      // Apply RTL to book content only
      const bookContent = document.querySelector('.theme-doc-markdown, article, .markdown');
      if (bookContent) {
        if (language === 'ur') {
          bookContent.setAttribute('dir', 'rtl');
          bookContent.classList.add('urdu-content');
        } else {
          bookContent.setAttribute('dir', 'ltr');
          bookContent.classList.remove('urdu-content');
        }
      }
    }
  }, [language]);

  // Listen for URL changes to update language state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleLocationChange = () => {
        const path = window.location.pathname;
        const isUrduPath = path.startsWith('/ur/');
        const currentLang = isUrduPath ? 'ur' : 'en';

        if (currentLang !== language) {
          setLanguageState(currentLang);
          localStorage.setItem('language', currentLang);
        }
      };

      // Listen to popstate (browser back/forward)
      window.addEventListener('popstate', handleLocationChange);

      return () => {
        window.removeEventListener('popstate', handleLocationChange);
      };
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
