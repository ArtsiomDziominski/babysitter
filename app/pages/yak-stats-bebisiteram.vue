<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Як стаць бебісітэрам
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                Далучайцеся да нашай платформы і пачніце працаваць правяраным бебісітэрам. Мы дапамагаем вопытным няням знайсці сям'і, якім патрэбна надзейная дапамога з дзецьмі.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Крокі
              </h2>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Зарэгіструйцеся на платформе
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Стварыце акаўнт і выберыце ролю Бебісітэр. Запоўніце асноўную інфармацыю і прайдзіце верыфікацыю.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Запоўніце профіль
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Дадайце фота, вопыт працы, адукацыю, навыкі і сертыфікаты. Чым поўней ваш профіль, тым прывабней вы будзеце для бацькоў.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Усталюйце расклад
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Пазначце, калі вы даступныя для працы. Вы можаце ўсталяваць штотыднёвы расклад або адзначыць канкрэтныя даты.
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Пачніце прымаць заказы
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      Пасля праверкі вашага профіля вы з'явіцеся ў выніках пошуку і зможаце пачаць атрымліваць запыты на браніраванне ад бацькоў.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Патрабаванні
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li>Узрост ад 18 гадоў</li>
                <li>Вопыт працы з дзецьмі</li>
                <li>Дзеючыя дакументы, якія пацвярджаюць асобу</li>
                <li>Адказнасць і любоў да дзяцей</li>
                <li>Магчымасць прадставіць рэкамендацыі</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Перавагі працы з намі
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li>Гнуткі графік - працуйце, калі вам зручна</li>
                <li>Справядлівая аплата - усталёўвайце свае тарыфы</li>
                <li>Правяраныя кліенты - усе бацькі верыфікаваны</li>
                <li>Падтрымка 24/7 - мы заўсёды гатовы дапамагчы</li>
                <li>Бяспечная платформа - страхаванне і гарантыі</li>
              </ul>
            </section>

            <section class="mb-8">
              <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Гатовыя пачаць?
                </h3>
                <UButton to="/register" color="primary" size="lg">
                  Зарэгістравацца як бебісітэр
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
  title: 'Як стаць бебісітэрам',
  description: 'Даведайцеся, як стаць правяраным бебісітэрам на нашай платформе і пачаць зарабляць, займаючыся любімай справай.',
  ogTitle: 'Як стаць бебісітэрам',
  ogDescription: 'Даведайцеся, як стаць правяраным бебісітэрам на нашай платформе і пачаць зарабляць, займаючыся любімай справай.',
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Як стаць бебісітэрам',
  twitterDescription: 'Даведайцеся, як стаць правяраным бебісітэрам на нашай платформе і пачаць зарабляць, займаючыся любімай справай.',
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>
