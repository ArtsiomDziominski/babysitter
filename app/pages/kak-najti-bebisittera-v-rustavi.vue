<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Как найти бебиситтера в Рустави
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                Ищете надёжного бебиситтера в Рустави? Наша платформа поможет вам найти проверенного специалиста для ухода за вашими детьми. Все бебиситтеры проходят верификацию и имеют опыт работы с детьми.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Как найти бебиситтера в Рустави
              </h2>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Используйте поиск
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Перейдите в раздел поиска и укажите город Рустави. Вы сможете увидеть всех доступных бебиситтеров в вашем городе.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Изучите профили
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Просмотрите анкеты бебиситтеров: фото, опыт работы, отзывы родителей, цены и расписание. Обратите внимание на рейтинг и количество выполненных заказов.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Свяжитесь с бебиситтером
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Напишите выбранному бебиситтеру через встроенный мессенджер, чтобы обсудить детали, задать вопросы и договориться о встрече.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Забронируйте услугу
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Выберите удобную дату и время, укажите количество детей и особые требования. После подтверждения бронирования вы сможете оплатить услугу.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Преимущества поиска через нашу платформу
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li>Проверенные бебиситтеры - все специалисты проходят верификацию</li>
                <li>Удобный поиск - фильтры по цене, опыту, навыкам и доступности</li>
                <li>Безопасность - система отзывов и рейтингов</li>
                <li>Поддержка 24/7 - мы всегда готовы помочь</li>
                <li>Гибкая оплата - безопасные платежи через платформу</li>
              </ul>
            </section>

            <section class="mb-8">
              <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Готовы найти бебиситтера в Рустави?
                </h3>
                <UButton to="/search?city=rustavi" color="primary" size="lg">
                  Найти бебиситтера
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
  title: 'Как найти бебиситтера в Рустави',
  description: 'Ищете надёжного бебиситтера в Рустави? Наша платформа поможет найти проверенного специалиста для ухода за детьми.',
  ogTitle: 'Как найти бебиситтера в Рустави',
  ogDescription: 'Ищете надёжного бебиситтера в Рустави? Наша платформа поможет найти проверенного специалиста для ухода за детьми.',
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Как найти бебиситтера в Рустави',
  twitterDescription: 'Ищете надёжного бебиситтера в Рустави? Наша платформа поможет найти проверенного специалиста для ухода за детьми.',
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

