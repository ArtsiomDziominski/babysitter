<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Як стати бебісітером
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                Приєднуйтеся до нашої платформи та почніть працювати перевіреним бебісітером. Ми допомагаємо досвідченим няням знайти сім'ї, яким потрібна надійна допомога з дітьми.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Кроки
              </h2>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Зареєструйтеся на платформі
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Створіть акаунт і оберіть роль Бебісітер. Заповніть основну інформацію та пройдіть верифікацію.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Заповніть профіль
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Додайте фото, досвід роботи, освіту, навички та сертифікати. Чим повніший ваш профіль, тим привабливіший ви будете для батьків.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Встановіть розклад
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Вкажіть, коли ви доступні для роботи. Ви можете встановити щотижневий розклад або відзначити конкретні дати.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Почніть приймати замовлення
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Після перевірки вашого профілю ви з'явитеся в результатах пошуку та зможете почати отримувати запити на бронювання від батьків.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Вимоги
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li>Вік від 18 років</li>
                <li>Досвід роботи з дітьми</li>
                <li>Діючі документи, що посвідчують особу</li>
                <li>Відповідальність та любов до дітей</li>
                <li>Можливість надати рекомендації</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Переваги роботи з нами
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li>Гнучкий графік - працюйте, коли вам зручно</li>
                <li>Справедлива оплата - встановлюйте свої тарифи</li>
                <li>Перевірені клієнти - всі батьки верифіковані</li>
                <li>Підтримка 24/7 - ми завжди готові допомогти</li>
                <li>Безпечна платформа - страхування та гарантії</li>
              </ul>
            </section>

            <section class="mb-8">
              <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Готові почати?
                </h3>
                <UButton to="/register" color="primary" size="lg">
                  Зареєструватися як бебісітер
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
  title: 'Як стати бебісітером',
  description: 'Дізнайтеся, як стати перевіреним бебісітером на нашій платформі та почати заробляти, займаючись улюбленою справою.',
  ogTitle: 'Як стати бебісітером',
  ogDescription: 'Дізнайтеся, як стати перевіреним бебісітером на нашій платформі та почати заробляти, займаючись улюбленою справою.',
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Як стати бебісітером',
  twitterDescription: 'Дізнайтеся, як стати перевіреним бебісітером на нашій платформі та почати заробляти, займаючись улюбленою справою.',
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>
