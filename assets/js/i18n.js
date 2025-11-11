// Internationalization (i18n) module for Pragma IT website

class I18n {
    constructor() {
        this.currentLang = this.getStoredLanguage() || this.detectLanguage();
        this.translations = {};
        this.supportedLanguages = ['fr', 'nl', 'en'];
        this.fallbackLanguage = 'fr';
    }

    // Detect browser language
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();

        // Return detected language if supported, otherwise fallback
        return this.supportedLanguages.includes(langCode) ? langCode : this.fallbackLanguage;
    }

    // Get stored language from localStorage
    getStoredLanguage() {
        return localStorage.getItem('pragma-language');
    }

    // Store language preference
    setStoredLanguage(lang) {
        localStorage.setItem('pragma-language', lang);
    }

    // Load translation file
    async loadTranslations(lang) {
        try {
            console.log(`[i18n] Loading translations for: ${lang}`);
            const response = await fetch(`assets/translations/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}: ${response.status}`);
            }
            this.translations[lang] = await response.json();
            console.log(`[i18n] Successfully loaded translations for: ${lang}`);
            return this.translations[lang];
        } catch (error) {
            console.error('[i18n] Translation loading error:', error);
            // Load fallback language if available
            if (lang !== this.fallbackLanguage && !this.translations[this.fallbackLanguage]) {
                console.log(`[i18n] Loading fallback language: ${this.fallbackLanguage}`);
                return this.loadTranslations(this.fallbackLanguage);
            }
            return null;
        }
    }

    // Get translation by key path (e.g., "nav.home")
    t(keyPath) {
        const keys = keyPath.split('.');
        let value = this.translations[this.currentLang];

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                // Try fallback language
                value = this.translations[this.fallbackLanguage];
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        console.warn(`[i18n] Translation key not found: ${keyPath}`);
                        return keyPath;
                    }
                }
                break;
            }
        }

        return value;
    }

    // Initialize i18n system
    async init() {
        try {
            console.log(`[i18n] Starting initialization with language: ${this.currentLang}`);

            // Load translations for current language
            await this.loadTranslations(this.currentLang);

            // Preload other languages for faster switching (non-blocking)
            this.supportedLanguages.forEach(lang => {
                if (lang !== this.currentLang) {
                    this.loadTranslations(lang).catch(err => {
                        console.warn(`[i18n] Failed to preload ${lang}:`, err);
                    });
                }
            });

            // Apply translations to the page
            this.applyTranslations();

            // Update HTML lang attribute
            document.documentElement.lang = this.currentLang;

            // Initialize language switcher
            this.initLanguageSwitcher();

            console.log('[i18n] Initialization complete');
            return this;
        } catch (error) {
            console.error('[i18n] Initialization error:', error);
            throw error;
        }
    }

    // Apply translations to elements with data-i18n attribute
    applyTranslations() {
        // Update meta tags
        this.updateMetaTags();

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update elements with data-i18n-html (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        });

        // Update elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update elements with data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Update elements with data-i18n-alt
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            element.alt = this.t(key);
        });
    }

    // Update meta tags
    updateMetaTags() {
        document.title = this.t('meta.title');

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.t('meta.description');
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.content = this.t('meta.keywords');
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = this.t('meta.title');
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.content = this.t('meta.description');
        }
    }

    // Initialize language switcher
    initLanguageSwitcher() {
        const languageSwitcher = document.querySelector('.language-switcher');
        if (!languageSwitcher) {
            console.warn('[i18n] Language switcher not found');
            return;
        }

        const currentLangButton = languageSwitcher.querySelector('.current-lang');
        const langText = currentLangButton?.querySelector('.lang-text');
        const dropdown = languageSwitcher.querySelector('.lang-dropdown');

        console.log('[i18n] Initializing language switcher');

        // Update current language display
        if (langText) {
            langText.textContent = this.currentLang.toUpperCase();
        } else if (currentLangButton) {
            // Fallback if .lang-text doesn't exist
            currentLangButton.textContent = this.currentLang.toUpperCase();
        }

        // Update active state for current language
        this.updateActiveLangOption();

        // Toggle dropdown
        if (currentLangButton && dropdown) {
            currentLangButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = dropdown.classList.toggle('active');
                currentLangButton.setAttribute('aria-expanded', isOpen);
                console.log(`[i18n] Dropdown ${isOpen ? 'opened' : 'closed'}`);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!languageSwitcher.contains(e.target)) {
                    dropdown.classList.remove('active');
                    currentLangButton.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Handle language selection
        languageSwitcher.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const newLang = option.getAttribute('data-lang');

                console.log(`[i18n] Language option clicked: ${newLang}`);

                if (newLang && newLang !== this.currentLang) {
                    await this.changeLanguage(newLang);
                }
            });
        });
    }

    // Update active state for language options
    updateActiveLangOption() {
        document.querySelectorAll('.lang-option').forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Change language
    async changeLanguage(lang) {
        try {
            if (!this.supportedLanguages.includes(lang)) {
                console.error(`[i18n] Language ${lang} is not supported`);
                return;
            }

            console.log(`[i18n] Changing language to: ${lang}`);

            // Load translations if not already loaded
            if (!this.translations[lang]) {
                await this.loadTranslations(lang);
            }

            // Update current language
            this.currentLang = lang;
            this.setStoredLanguage(lang);

            // Update HTML lang attribute
            document.documentElement.lang = lang;

            // Update current language display
            const langText = document.querySelector('.lang-text');
            const currentLangButton = document.querySelector('.current-lang');

            if (langText) {
                langText.textContent = lang.toUpperCase();
            } else if (currentLangButton) {
                // Fallback
                currentLangButton.textContent = lang.toUpperCase();
            }

            // Update active state
            this.updateActiveLangOption();

            // Apply translations
            this.applyTranslations();

            // Close dropdown
            const dropdown = document.querySelector('.lang-dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
            if (currentLangButton) {
                currentLangButton.setAttribute('aria-expanded', 'false');
            }

            // Trigger custom event
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));

            // Update form validation messages
            if (window.PragmaCell && window.PragmaCell.updateValidationMessages) {
                window.PragmaCell.updateValidationMessages();
            }

            console.log(`[i18n] Language changed successfully to: ${lang}`);
        } catch (error) {
            console.error('[i18n] Error changing language:', error);
        }
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Get supported languages
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// Create and export global instance
const i18nInstance = new I18n();
window.i18n = i18nInstance;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[i18n] DOM loaded, initializing...');
        window.i18n.init().then(() => {
            console.log('[i18n] Ready!');
        }).catch(error => {
            console.error('[i18n] Failed to initialize:', error);
        });
    });
} else {
    console.log('[i18n] DOM already loaded, initializing immediately...');
    window.i18n.init().then(() => {
        console.log('[i18n] Ready!');
    }).catch(error => {
        console.error('[i18n] Failed to initialize:', error);
    });
}
