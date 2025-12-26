// https://nuxt.com/docs/api/configuration/nuxt-config
import siteConfig from './app/config/site/babysitters'

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
            { code: 'ka', iso: 'ka-GE', file: 'ka.json', name: 'ქართული' },
            { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
            { code: 'ru', iso: 'ru-RU', file: 'ru.json', name: 'Русский' },
            // { code: 'be', iso: 'be-BY', file: 'be.json', name: 'Беларуская' },
            { code: 'uk', iso: 'uk-UA', file: 'uk.json', name: 'Українська' }
        ],
        langDir: 'locales',
        defaultLocale: 'en', // ru
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
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3003',
            siteUrl: process.env.SITE_URL || siteConfig.url,
            siteName: process.env.SITE_NAME || siteConfig.name,
            siteConfig: {
                ...siteConfig,
                name: process.env.SITE_NAME || siteConfig.name,
                url: process.env.SITE_URL || siteConfig.url,
                keywords: [...siteConfig.keywords]
            } as any
        }
    },
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            titleTemplate: '%s - ' + (process.env.SITE_NAME || siteConfig.name),
            meta: [
                { name: 'format-detection', content: 'telephone=no' }
            ]
        }
    }
})
