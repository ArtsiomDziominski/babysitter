export default {
    name: 'Babysitters',
    url: 'https://babysitters.com',
    logo: '/logo.jpg',
    description: 'Babysitters is a platform for finding babysitters near you',
    keywords: [
        'babysitters', 'babysitter', 'babysitting', 'babysitter near me', 'babysitter near you', 'babysitter near my location',
        'ბაბისიტერები', 'ბაბისიტერი', 'ბაბისიტერები მისგან', 'ბაბისიტერები მისგან', 'ბაბისიტერები მისგან',
        'няня', 'няни', 'бебиситтер', 'бебиситтеры', 'няня рядом', 'няня рядом со мной', 'найти няню', 'услуги няни', 'няня для ребенка',
        'няня', 'няні', 'бебісітер', 'бебісітери', 'няня поруч', 'няня поруч зі мною', 'знайти няню', 'послуги няні', 'няня для дитини'
    ],
    author: 'Babysitters',
    authorUrl: 'https://babysitters.ge',
    authorEmail: 'info@babysitters.ge',
    authorPhone: '',
    authorAddress: '123 Main St, Anytown, USA',
    authorCity: 'Anytown',
    authorState: 'CA',
    authorZip: '12345',
    currency: 'GEL',
    locales: [
        { code: 'ka', iso: 'ka-GE', file: 'ka.json', name: 'ქართული' },
        { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
        { code: 'ru', iso: 'ru-RU', file: 'ru.json', name: 'Русский' },
        // { code: 'be', iso: 'be-BY', file: 'be.json', name: 'Беларуская' },
        { code: 'uk', iso: 'uk-UA', file: 'uk.json', name: 'Українська' }
    ],
    defaultLocale: 'ka',
    langDir: 'locales'
} as const