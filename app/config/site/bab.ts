export default {
    name: 'Bab',
    url: 'https://babysitters.com',
    logo: '/logo.jpg',
    description: 'Babysitters is a platform for finding babysitters near you',
    keywords: ['babysitters', 'babysitter', 'babysitting', 'babysitter near me', 'babysitter near you', 'babysitter near my location'],
    author: 'Babysitters',
    authorUrl: 'https://babysitters.com',
    authorEmail: 'info@babysitters.com',
    authorPhone: '+1234567890',
    authorAddress: '123 Main St, Anytown, USA',
    authorCity: 'Anytown',
    authorState: 'CA',
    authorZip: '12345',
    locales: [
        { code: 'ka', iso: 'ka-GE', file: 'ka.json', name: 'ქართული' },
        { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
        { code: 'ru', iso: 'ru-RU', file: 'ru.json', name: 'Русский' },
        // { code: 'be', iso: 'be-BY', file: 'be.json', name: 'Беларуская' },
        { code: 'uk', iso: 'uk-UA', file: 'uk.json', name: 'Українська' }
    ],
    defaultLocale: 'en',
    langDir: 'locales'
} as const