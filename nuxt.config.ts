// https://nuxt.com/docs/api/configuration/nuxt-config
const siteConfigFile = process.env.SITE_CONFIG || 'sitter'
let siteConfig: any

try {
    siteConfig = require(`./app/config/site/${siteConfigFile}`).default
} catch (error) {
    console.warn(`Site config file "${siteConfigFile}" not found, falling back to "babysitters"`)
    siteConfig = require('./app/config/site/babysitters').default
}

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
        locales: [...siteConfig.locales],
        langDir: siteConfig.langDir,
        defaultLocale: siteConfig.defaultLocale,
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
    },
    routeRules: {
        '/kak-stat-bebisitterom': { prerender: false, ssr: true },
        '/how-to-become-babysitter': { prerender: false, ssr: true },
        '/yak-staty-bebisiterom': { prerender: false, ssr: true },
        '/yak-stats-bebisiteram': { prerender: false, ssr: true },
        '/rogor-gavides-bebisiteri': { prerender: false, ssr: true },
        '/become-sitter': { prerender: false, ssr: true },
        '/kak-najti-bebisittera-v-tbilisi': { prerender: false, ssr: true },
        '/kak-najti-nyanyu-v-tbilisi': { prerender: false, ssr: true },
        '/kak-najti-bebisittera-v-batumi': { prerender: false, ssr: true },
        '/kak-najti-nyanyu-v-batumi': { prerender: false, ssr: true },
        '/kak-najti-bebisittera-v-kutaisi': { prerender: false, ssr: true },
        '/kak-najti-nyanyu-v-kutaisi': { prerender: false, ssr: true },
        '/kak-najti-bebisittera-v-rustavi': { prerender: false, ssr: true },
        '/kak-najti-nyanyu-v-rustavi': { prerender: false, ssr: true },
        '/kak-najti-bebisittera-v-gori': { prerender: false, ssr: true },
        '/kak-najti-nyanyu-v-gori': { prerender: false, ssr: true },
        '/kak-najti-bebisittera-v-poti': { prerender: false, ssr: true },
        '/kak-najti-nyanyu-v-poti': { prerender: false, ssr: true }
    }
})
