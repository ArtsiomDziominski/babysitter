<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Как найти няню в Рустави
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                Нужна профессиональная няня в Рустави? Наша платформа предлагает проверенных специалистов с опытом работы с детьми разного возраста. Все няни проходят тщательный отбор и верификацию.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Как найти няню в Рустави
              </h2>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Выберите город Рустави
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      В разделе поиска укажите город Рустави. Система покажет всех доступных нянь в вашем городе с их профилями и расписанием.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Примените фильтры
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Используйте фильтры для поиска няни по опыту работы, образованию, навыкам, цене и доступности. Вы можете найти няню с медицинским или педагогическим образованием.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Изучите анкеты нянь
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Просмотрите подробные профили: образование, сертификаты, опыт работы, отзывы других родителей, фотографии и цены. Обратите внимание на специализацию няни.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Свяжитесь и забронируйте
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Напишите понравившейся няне, обсудите все детали, особые требования к уходу за ребёнком и забронируйте услугу на удобное время.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Что учитывать при выборе няни
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li>Опыт работы с детьми нужного возраста</li>
                <li>Образование и дополнительные сертификаты</li>
                <li>Отзывы и рейтинг от других родителей</li>
                <li>Гибкость графика и доступность</li>
                <li>Специализация (работа с младенцами, особыми детьми и т.д.)</li>
              </ul>
            </section>

            <section class="mb-8">
              <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Найти няню в Рустави
                </h3>
                <UButton to="/search?city=rustavi" color="primary" size="lg">
                  Найти няню
                </UButton>
              </div>
            </section>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageTransition: false
})

const { locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: 'Как найти няню в Рустави',
  description: 'Нужна профессиональная няня в Рустави? Наша платформа предлагает проверенных специалистов с опытом работы с детьми.',
  ogTitle: 'Как найти няню в Рустави',
  ogDescription: 'Нужна профессиональная няня в Рустави? Наша платформа предлагает проверенных специалистов с опытом работы с детьми.',
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Как найти няню в Рустави',
  twitterDescription: 'Нужна профессиональная няня в Рустави? Наша платформа предлагает проверенных специалистов с опытом работы с детьми.',
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

