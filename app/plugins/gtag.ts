// Google Analytics 4: тег вставляется в <head> каждой страницы (в том числе при SSR),
// переходы внутри SPA GA4 отслеживает сам через history events (enhanced measurement)
export default defineNuxtPlugin(() => {
    const id = useRuntimeConfig().public.gaMeasurementId
    if (!id) return

    useHead({
        script: [
            { src: `https://www.googletagmanager.com/gtag/js?id=${id}`, async: true },
            {
                innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`
            }
        ]
    })
})
