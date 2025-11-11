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
            const response = await fetch(`assets/translations/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}`);
            }
            this.translations[lang] = await response.json();
            return this.translations[lang];
        } catch (error) {
            console.error('Translation loading error:', error);
            // Load fallback language if available
            if (lang !== this.fallbackLanguage && !this.translations[this.fallbackLanguage]) {
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
                        console.warn(`Translation key not found: ${keyPath}`);
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
        // Load translations for current language
        await this.loadTranslations(this.currentLang);

        // Preload other languages for faster switching
        this.supportedLanguages.forEach(lang => {
            if (lang !== this.currentLang) {
                this.loadTranslations(lang);
            }
        });

        // Apply translations to the page
        this.applyTranslations();

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;

        // Initialize language switcher
        this.initLanguageSwitcher();

        return this;
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
        if (!languageSwitcher) return;

        const currentLangButton = languageSwitcher.querySelector('.current-lang');
        const dropdown = languageSwitcher.querySelector('.lang-dropdown');

        // Update current language display
        if (currentLangButton) {
            currentLangButton.textContent = this.currentLang.toUpperCase();
        }

        // Toggle dropdown
        if (currentLangButton && dropdown) {
            currentLangButton.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });
        }

        // Handle language selection
        languageSwitcher.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', async (e) => {
                e.preventDefault();
                const newLang = option.getAttribute('data-lang');

                if (newLang && newLang !== this.currentLang) {
                    await this.changeLanguage(newLang);
                }
            });
        });
    }

    // Change language
    async changeLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error(`Language ${lang} is not supported`);
            return;
        }

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
        const currentLangButton = document.querySelector('.current-lang');
        if (currentLangButton) {
            currentLangButton.textContent = lang.toUpperCase();
        }

        // Apply translations
        this.applyTranslations();

        // Close dropdown
        const dropdown = document.querySelector('.lang-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }

        // Trigger custom event
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));

        // Update form validation messages
        if (window.PragmaCell && window.PragmaCell.updateValidationMessages) {
            window.PragmaCell.updateValidationMessages();
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

// Create global instance
window.i18n = new I18n();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.i18n.init();
    });
} else {
    window.i18n.init();
}
