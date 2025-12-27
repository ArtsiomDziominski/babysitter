<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          საჯარო შეთავაზება
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
          ბოლო განახლება: {{ lastUpdated }}
        </p>

        <div class="prose prose-gray dark:prose-invert max-w-none">
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. შეთავაზების საგანი
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ეს საჯარო შეთავაზება განსაზღვრავს ბებისიტერების ძიების პლატფორმის გამოყენების პირობებს. 
              პლატფორმა უზრუნველყოფს საინფორმაციო სერვისს, რომელიც საშუალებას აძლევს მშობლებს 
              იპოვონ ბებისიტერები და დაუკავშირდნენ მათ ბავშვების მოვლის სერვისების ორგანიზებისთვის.
            </p>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმა ასრულებს მხოლოდ შუამავლის ფუნქციებს მშობლებსა და ბებისიტერებს შორის, 
              უზრუნველყოფს ინსტრუმენტებს ძიების, პროფილების ნახვისა და მხარეებს შორის კავშირის დამყარებისთვის.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. პასუხისმგებლობის შეზღუდვა
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              <strong>მნიშვნელოვანია:</strong> პლატფორმა არ არის პასუხისმგებელი რაიმე შემთხვევაზე, 
              უბედურ შემთხვევაზე, ზიანზე ან სხვა ნეგატიურ შედეგებზე, რომლებიც შეიძლება წარმოიშვას 
              მშობლებსა და ბებისიტერებს შორის ურთიერთქმედების შედეგად.
            </p>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმა უზრუნველყოფს მხოლოდ ტექნიკურ საშუალებებს მომხმარებლებს შორის ძიებისა და 
              კონტაქტის დამყარებისთვის. ყველა შეთანხმება, სამუშაო პირობები, გადახდა და სხვა ასპექტები 
              მშობლებსა და ბებისიტერებს შორის ურთიერთქმედებისა არის პირდაპირი შეთანხმებების საგანი 
              მათ შორის, პლატფორმის მონაწილეობის გარეშე.
            </p>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმა არ გარანტირებს:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>ბებისიტერების მიერ გაწეული სერვისების ხარისხს</li>
              <li>ბავშვების უსაფრთხოებას სერვისების გაწევის დროს</li>
              <li>მომხმარებლების პროფილებში მითითებული ინფორმაციის სანდოობას</li>
              <li>მშობლებსა და ბებისიტერებს შორის ვალდებულებების შესრულებას</li>
              <li>კონფლიქტების ან დავების არარსებობას მხარეებს შორის</li>
            </ul>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              მშობლები და ბებისიტერები ატარებენ სრულ პასუხისმგებლობას მათი ურთიერთქმედების ყველა ასპექტზე, 
              მათ შორის ბავშვების უსაფრთხოებაზე, სერვისების ხარისხზე, გადახდაზე და შეთანხმებების შესრულებაზე.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. გამოყენების პირობები
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმის გამოყენებით, თქვენ ეთანხმებით ამ შეთავაზების პირობებს. 
              პლატფორმა მოწოდებულია "როგორც არის", ყოველგვარი გარანტიის გარეშე.
            </p>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              მომხმარებლები ვალდებულნი არიან:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>მიაწოდონ სანდო ინფორმაცია რეგისტრაციისას</li>
              <li>დაიცვან პლატფორმის წესები და კანონმდებლობა</li>
              <li>არ გამოიყენონ პლატფორმა უკანონო მიზნებისთვის</li>
              <li>პატივი სცენ სხვა მომხმარებლების უფლებებს</li>
            </ul>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმა იტოვებს უფლებას შეზღუდოს წვდომა ან წაშალოს მომხმარებლის ანგარიში 
              გამოყენების პირობების დარღვევის შემთხვევაში.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. კონტაქტი
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              თუ თქვენ გაქვთ შეკითხვები ამ შეთავაზების პირობებთან დაკავშირებით, გთხოვთ დაგვიკავშირდეთ:
            </p>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
              <p class="text-gray-700 dark:text-gray-300">
                <strong>ელფოსტა:</strong> info@babysitter.by
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`
const lastUpdated = '2024-01-15'
const pageTitle = 'საჯარო შეთავაზება'
const pageDescription = 'საჯარო შეთავაზება - ბებისიტერების ძიების პლატფორმის გამოყენების პირობები. პლატფორმა უზრუნველყოფს მხოლოდ ძიებასა და კონტაქტს მშობლებსა და ბებისიტერებს შორის.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

