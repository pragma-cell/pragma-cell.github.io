// Simple and robust i18n system for Pragma IT

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        supportedLanguages: ['fr', 'nl', 'en'],
        defaultLanguage: 'fr',
        storageKey: 'pragma-language',
        translationsPath: 'assets/translations/'
    };

    // State
    let currentLanguage = null;
    let translations = {};

    // Get stored language or detect browser language
    function getInitialLanguage() {
        // Check localStorage first
        const stored = localStorage.getItem(CONFIG.storageKey);
        if (stored && CONFIG.supportedLanguages.includes(stored)) {
            console.log('[i18n] Using stored language:', stored);
            return stored;
        }

        // Detect browser language
        const browserLang = (navigator.language || navigator.userLanguage).split('-')[0].toLowerCase();
        if (CONFIG.supportedLanguages.includes(browserLang)) {
            console.log('[i18n] Detected browser language:', browserLang);
            return browserLang;
        }

        // Fallback to default
        console.log('[i18n] Using default language:', CONFIG.defaultLanguage);
        return CONFIG.defaultLanguage;
    }

    // Load translation file
    async function loadTranslation(lang) {
        if (translations[lang]) {
            console.log('[i18n] Translation already loaded:', lang);
            return translations[lang];
        }

        try {
            console.log('[i18n] Loading translation file:', lang);
            const response = await fetch(`${CONFIG.translationsPath}${lang}.json`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            translations[lang] = data;
            console.log('[i18n] Translation loaded successfully:', lang);
            return data;
        } catch (error) {
            console.error(`[i18n] Failed to load translation for ${lang}:`, error);
            throw error;
        }
    }

    // Get translated text by key path
    function translate(keyPath, lang = currentLanguage) {
        const keys = keyPath.split('.');
        let value = translations[lang];

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`[i18n] Translation not found: ${keyPath} (${lang})`);
                return keyPath;
            }
        }

        return value;
    }

    // Apply translations to DOM
    function applyTranslations() {
        console.log('[i18n] Applying translations...');

        // Update page title
        document.title = translate('meta.title');

        // Update meta tags
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.content = translate('meta.description');

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) metaKeywords.content = translate('meta.keywords');

        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = translate(key);

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = translate(key);
        });

        console.log('[i18n] Translations applied');
    }

    // Update language buttons UI
    function updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === currentLanguage) {
                btn.classList.add('active');
                btn.setAttribute('aria-current', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-current', 'false');
            }
        });
    }

    // Change language
    async function changeLanguage(newLang) {
        if (!CONFIG.supportedLanguages.includes(newLang)) {
            console.error('[i18n] Unsupported language:', newLang);
            return;
        }

        if (newLang === currentLanguage) {
            console.log('[i18n] Already using this language:', newLang);
            return;
        }

        try {
            console.log('[i18n] Changing language to:', newLang);

            // Load translation if not already loaded
            await loadTranslation(newLang);

            // Update current language
            currentLanguage = newLang;
            localStorage.setItem(CONFIG.storageKey, newLang);

            // Update HTML lang attribute
            document.documentElement.lang = newLang;

            // Apply translations
            applyTranslations();

            // Update UI
            updateLanguageButtons();

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: newLang }
            }));

            console.log('[i18n] Language changed successfully to:', newLang);
        } catch (error) {
            console.error('[i18n] Failed to change language:', error);
        }
    }

    // Initialize language switcher buttons
    function initLanguageSwitcher() {
        const buttons = document.querySelectorAll('.lang-btn');

        if (buttons.length === 0) {
            console.warn('[i18n] No language buttons found');
            return;
        }

        console.log('[i18n] Initializing language buttons:', buttons.length);

        buttons.forEach(btn => {
            const lang = btn.getAttribute('data-lang');

            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log('[i18n] Button clicked:', lang);
                await changeLanguage(lang);
            });
        });

        // Set initial active state
        updateLanguageButtons();
    }

    // Initialize the i18n system
    async function init() {
        try {
            console.log('[i18n] ===== Initializing i18n system =====');

            // Get initial language
            currentLanguage = getInitialLanguage();

            // Load initial translation
            await loadTranslation(currentLanguage);

            // Preload other languages (non-blocking)
            CONFIG.supportedLanguages.forEach(lang => {
                if (lang !== currentLanguage) {
                    loadTranslation(lang).catch(err => {
                        console.warn(`[i18n] Failed to preload ${lang}:`, err.message);
                    });
                }
            });

            // Apply translations
            applyTranslations();

            // Update HTML lang
            document.documentElement.lang = currentLanguage;

            // Initialize switcher
            initLanguageSwitcher();

            console.log('[i18n] ===== Initialization complete =====');
            console.log('[i18n] Current language:', currentLanguage);
            console.log('[i18n] Loaded translations:', Object.keys(translations));

        } catch (error) {
            console.error('[i18n] ===== Initialization failed =====');
            console.error('[i18n] Error:', error);
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export API
    window.i18n = {
        getCurrentLanguage: () => currentLanguage,
        getSupportedLanguages: () => CONFIG.supportedLanguages,
        changeLanguage: changeLanguage,
        translate: translate,
        reload: applyTranslations
    };

})();
