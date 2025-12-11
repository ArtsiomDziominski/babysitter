// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/ui', '@nuxt/icon', '@nuxtjs/i18n', '@pinia/nuxt'],
    css: ['~/assets/css/main.css'],
    ui: {
        theme: {
            transitions: false
        }
    },
    i18n: {
        locales: [
            { code: 'ru', iso: 'ru-RU', file: 'ru.json', name: 'Русский' },
            { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
            { code: 'be', iso: 'be-BY', file: 'be.json', name: 'Беларуская' }
        ],
        langDir: 'locales',
        defaultLocale: 'ru',
        strategy: 'no_prefix',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root'
        },
        bundle: {
            // @ts-ignore optimizeTranslationDirective support depends on module version
            optimizeTranslationDirective: false
        }
    }
})
