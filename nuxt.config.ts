// https://nuxt.com/docs/api/configuration/nuxt-config
const siteConfigFile = process.env.SITE_CONFIG || 'sitter'
let siteConfig: any

try {
    siteConfig = require(`./app/config/site/${siteConfigFile}`).default
} catch (error) {
    console.warn(`Site config file "${siteConfigFile}" not found, falling back to "sitter"`)
    siteConfig = require('./app/config/site/sitter').default
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
    fonts: {
        families: [
            { name: 'Unbounded', provider: 'google', weights: [500, 600, 700, 800] },
            { name: 'Onest', provider: 'google', weights: [400, 500, 600, 700] }
        ]
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
        strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
        strapiApiToken: process.env.STRAPI_API_TOKEN || '',
        public: {
            apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3003',
            siteUrl: process.env.SITE_URL || siteConfig.url,
            siteName: process.env.SITE_NAME || siteConfig.name,
            // Переопределяется через NUXT_PUBLIC_GA_MEASUREMENT_ID, пустое значение отключает GA
            gaMeasurementId: 'G-X0XKEG9JE7',
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
        '/blog': { prerender: true },
        '/blog/**': { prerender: true }
    },
    nitro: {
        prerender: {
            // Обход ссылок пререндерил /, /search, /login и все /account/** как статический HTML
            // без авторизации и языка пользователя — такие страницы должны рендериться на сервере
            crawlLinks: false,
            routes: ['/blog']
        }
    }
})
