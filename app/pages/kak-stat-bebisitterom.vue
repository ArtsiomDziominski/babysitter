<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Как стать бебиситтером
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                Присоединяйтесь к нашей платформе и начните работать проверенным бебиситтером. Мы помогаем опытным няням найти семьи, которым нужна надёжная помощь с детьми.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Шаги
              </h2>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Зарегистрируйтесь на платформе
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Создайте аккаунт и выберите роль Бебиситтер. Заполните основную информацию и пройдите верификацию.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Заполните профиль
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Добавьте фото, опыт работы, образование, навыки и сертификаты. Чем полнее ваш профиль, тем привлекательнее вы будете для родителей.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Установите расписание
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Укажите, когда вы доступны для работы. Вы можете установить еженедельное расписание или отметить конкретные даты.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Начните принимать заказы
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      После проверки вашего профиля вы появитесь в результатах поиска и сможете начать получать запросы на бронирование от родителей.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Требования
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li>Возраст от 18 лет</li>
                <li>Опыт работы с детьми</li>
                <li>Действующие документы, удостоверяющие личность</li>
                <li>Ответственность и любовь к детям</li>
                <li>Возможность предоставить рекомендации</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Преимущества работы с нами
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li>Гибкий график - работайте когда вам удобно</li>
                <li>Справедливая оплата - устанавливайте свои тарифы</li>
                <li>Проверенные клиенты - все родители верифицированы</li>
                <li>Поддержка 24/7 - мы всегда готовы помочь</li>
                <li>Безопасная платформа - страхование и гарантии</li>
              </ul>
            </section>

            <section class="mb-8">
              <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Готовы начать?
                </h3>
                <UButton to="/register" color="primary" size="lg">
                  Зарегистрироваться как бебиситтер
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
const { locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: 'Как стать бебиситтером',
  description: 'Узнайте, как стать проверенным бебиситтером на нашей платформе и начать зарабатывать, занимаясь любимым делом.',
  ogTitle: 'Как стать бебиситтером',
  ogDescription: 'Узнайте, как стать проверенным бебиситтером на нашей платформе и начать зарабатывать, занимаясь любимым делом.',
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Как стать бебиситтером',
  twitterDescription: 'Узнайте, как стать проверенным бебиситтером на нашей платформе и начать зарабатывать, занимаясь любимым делом.',
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

