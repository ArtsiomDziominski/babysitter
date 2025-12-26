<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          გამოყენების პირობები
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
          ბოლო განახლება: {{ lastUpdated }}
        </p>

        <div class="prose prose-gray dark:prose-invert max-w-none">
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. შესავალი
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              კეთილი მოგვესალმებათ ჩვენს პლატფორმაზე. ეს გამოყენების პირობები არეგულირებს თქვენს წვდომას და გამოყენებას 
              ჩვენი სერვისებისა და ვებსაიტის მიმართ. პლატფორმის გამოყენებით, თქვენ ეთანხმებით ამ პირობებს. 
              თუ არ ეთანხმებით, გთხოვთ არ გამოიყენოთ ჩვენი სერვისები.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. განმარტებები
            </h2>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li><strong>პლატფორმა:</strong> ვებსაიტი და მობილური აპლიკაცია, რომელიც აკავშირებს ბებისიტერებსა და მშობლებს</li>
              <li><strong>მომხმარებელი:</strong> ნებისმიერი პირი, რომელიც იყენებს პლატფორმას</li>
              <li><strong>ბებისიტერი:</strong> მომხმარებელი, რომელიც გთავაზობთ ბებისიტერების მომსახურებას</li>
              <li><strong>მშობელი:</strong> მომხმარებელი, რომელიც ეძებს ბებისიტერის მომსახურებას</li>
              <li><strong>დაჯავშნა:</strong> მომსახურების შეკვეთა ბებისიტერისგან</li>
              <li><strong>სერვისი:</strong> ბებისიტერების მომსახურება, რომელიც მოწოდებულია პლატფორმის მეშვეობით</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. ანგარიშის შექმნა და პასუხისმგებლობა
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმის გამოყენებისთვის, თქვენ უნდა შექმნათ ანგარიში. თქვენ პასუხისმგებლობას იღებთ:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>საკუთარი ანგარიშის უსაფრთხოების დაცვაზე</li>
              <li>პაროლისა და ანგარიშის დეტალების კონფიდენციალურობაზე</li>
              <li>ანგარიშის საშუალებით შესრულებული ყველა მოქმედებისთვის</li>
              <li>სწორი და განახლებული ინფორმაციის მოწოდებაზე</li>
              <li>18 წლის ასაკის მიღწევისთვის ან მშობლის თანხმობის მიღებისთვის, თუ თქვენ ხართ არასრულწლოვანი</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. ბებისიტერების პასუხისმგებლობა
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ბებისიტერები, რომლებიც პლატფორმის საშუალებით მომსახურებას გთავაზობთ, პასუხისმგებლობას იღებენ:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>თავიანთი კვალიფიკაციისა და გამოცდილების სწორი წარდგენისთვის</li>
              <li>ნებართვებისა და სერთიფიკატების სისწორისთვის</li>
              <li>დაჯავშნების დროულად შესრულებისთვის</li>
              <li>ბავშვების უსაფრთხოებისა და კეთილდღეობისთვის</li>
              <li>პროფესიონალური და ეთიკური ქცევისთვის</li>
              <li>მშობლებთან კომუნიკაციისთვის</li>
              <li>ბავშვების სპეციალური საჭიროებების გათვალისწინებისთვის</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. მშობლების პასუხისმგებლობა
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              მშობლები, რომლებიც პლატფორმის საშუალებით ეძებენ ბებისიტერებს, პასუხისმგებლობას იღებენ:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>ბავშვების შესახებ ზუსტი ინფორმაციის მოწოდებისთვის</li>
              <li>სპეციალური საჭიროებების, ალერგიებისა და სამედიცინო პირობების დეტალური აღწერისთვის</li>
              <li>გადახდის დროულად შესრულებისთვის</li>
              <li>ბებისიტერისთან გაწეული შეთანხმების პირობების დაცვისთვის</li>
              <li>ბებისიტერისთან პატიოსნი და პატიოსანი ურთიერთობისთვის</li>
              <li>ბავშვების დაბრუნების დროისა და პირობების სწორად მითითებისთვის</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. გადახდები და ანაზღაურება
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              გადახდები ხდება პლატფორმის საშუალებით. პლატფორმა ითვალისწინებს:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>პლატფორმის საკომისიო ბებისიტერების მომსახურების საფასურის გარკვეული პროცენტის სახით</li>
              <li>გადახდის დამუშავებას უსაფრთხო გადახდის სისტემების საშუალებით</li>
              <li>ანაზღაურების პოლიტიკა, რომელიც განსაზღვრულია ცალკე დოკუმენტში</li>
              <li>გადახდის სისტემაში შესაძლო საკომისიოს</li>
            </ul>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed mt-4">
              გადახდების განხორციელებისა და ანაზღაურების დეტალური ინფორმაცია მოცემულია პლატფორმაზე.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. გაუქმება და დაბრუნება
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              გაუქმებისა და დაბრუნების პოლიტიკა:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>დაჯავშნის გაუქმება შესაძლებელია მხარეების შეთანხმებით</li>
              <li>გაუქმების პირობები მითითებულია დაჯავშნის დროს</li>
              <li>გაუქმების შემთხვევაში, დაბრუნება ხდება პლატფორმის პოლიტიკის შესაბამისად</li>
              <li>გაუქმების ვადები შეიძლება განსხვავდებოდეს სხვადასხვა ტიპის დაჯავშნებზე</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. პლატფორმის როლი
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ჩვენი პლატფორმა არის მხოლოდ შუამავალი, რომელიც აკავშირებს ბებისიტერებსა და მშობლებს. 
              პლატფორმა არ არის პასუხისმგებელი:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>ბებისიტერების ქმედებებზე ან მომსახურების ხარისხზე</li>
              <li>მშობლების ქმედებებზე</li>
              <li>მხარეებს შორის წარმოქმნილ კონფლიქტებზე</li>
              <li>ბავშვების უსაფრთხოებაზე დაჯავშნის დროს</li>
              <li>შეთანხმების პირობების შესრულებაზე</li>
            </ul>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed mt-4">
              პლატფორმა არ არის დასაქმებელი და არ არის პასუხისმგებელი ბებისიტერებისა და მშობლების შორის პირდაპირ 
              ურთიერთობაზე ან შეთანხმებაზე.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. აკრძალული მოქმედებები
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმის გამოყენებისას აკრძალულია:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>ყალბი, მოტყუებისა და დეზინფორმაციის მოწოდება</li>
              <li>სხვა მომხმარებლებთან პირდაპირი გადახდების მოთხოვნა პლატფორმის გარეთ</li>
              <li>სპამის, რეკლამისა და ზედმეტი მარკეტინგული სკამების გაგზავნა</li>
              <li>სხვა მომხმარებლების პირადი ინფორმაციის გამოყენება უკანონო მიზნებისთვის</li>
              <li>პლატფორმის სისტემებისა და ინფრასტრუქტურის დაზიანება</li>
              <li>ვირუსების, ტროიელებისა და მავნე პროგრამების გავრცელება</li>
              <li>პლატფორმის კოდის რევერსული ინჟინერია ან მოპირება</li>
              <li>რეგისტრაციის მრავალჯერადი ანგარიშების შექმნა</li>
              <li>სხვა მომხმარებლების ანგარიშების მოპარება</li>
              <li>პლატფორმის გამოყენება უკანონო აქტივობებისთვის</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. გამოხმაურებები და რეიტინგები
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმა გთავაზობთ გამოხმაურებისა და რეიტინგების სისტემას:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>გამოხმაურებები უნდა იყოს ზუსტი, სამართლიანი და პატიოსანი</li>
              <li>აკრძალულია ყალბი გამოხმაურებების გაგზავნა</li>
              <li>აკრძალულია გამოხმაურებების მანიპულირება ან გადაჭარბებული რეიტინგების მოთხოვნა</li>
              <li>პლატფორმას უფლება აქვს წაშალოს არასათანადო გამოხმაურებები</li>
              <li>გამოხმაურებები არის მხოლოდ მომხმარებლების მოსაზრებები და არ ასახავს პლატფორმის პოზიციას</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. ინტელექტუალური საკუთრება
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმის ყველა შინაარსი, დიზაინი, ლოგო, ტექსტი, გრაფიკა და სოფტვერი არის პლატფორმის ან მისი 
              ლიცენზირების მფლობელების საკუთრება და დაცულია საავტორო უფლებებისა და სხვა ინტელექტუალური საკუთრების კანონებით.
            </p>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              თქვენ არ გაქვთ უფლება გამოიყენოთ, აწარმოოთ, გადაიწეროთ, გაავრცელოთ ან შექმნათ პლატფორმის შინაარსის 
              წარმოებული სამუშაოები ჩვენი წინასწარი წერილობითი თანხმობის გარეშე.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              12. სერვისის შეწყვეტა
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმას უფლება აქვს, თავისი შეხედულებისამებრ, შეწყვიტოს ან შეზღუდოს თქვენი წვდომა პლატფორმაზე:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>ამ პირობების დარღვევის შემთხვევაში</li>
              <li>სახელმწიფო ორგანოების მოთხოვნით</li>
              <li>სერვისის გაუმჯობესების ან ტექნიკური მხარდაჭერის მიზნით</li>
              <li>თქვენი ანგარიშის არაკანონიერი მოქმედების გამო</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              13. განახლებები და ცვლილებები
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმას უფლება აქვს დროდადრო განაახლოს ეს გამოყენების პირობები. ცვლილებების შემთხვევაში, 
              ჩვენ განვაახლებთ "ბოლო განახლების" თარიღს. თქვენი პლატფორმის გამოყენების გაგრძელება ნიშნავს, 
              რომ თქვენ ეთანხმებით განახლებულ პირობებს.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              14. პასუხისმგებლობის შეზღუდვა
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              პლატფორმა მოწოდებულია "როგორც არის" და "როგორც შესაძლებელია". პლატფორმა არ არის პასუხისმგებელი:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>შეცდომების, გაუმართაობის ან სერვისის შეწყვეტისთვის</li>
              <li>მონაცემების დაკარგვისთვის</li>
              <li>ვირუსების ან მავნე პროგრამების გავრცელებისთვის</li>
              <li>პირდაპირი, ირიბი, შემთხვევითი, სპეციალური ან შედეგად მიღებული ზიანისთვის</li>
              <li>ბებისიტერებისა და მშობლების შორის წარმოქმნილი კონფლიქტებისთვის</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              15. კონტაქტი
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              თუ თქვენ გაქვთ შეკითხვები ამ გამოყენების პირობებთან დაკავშირებით, გთხოვთ დაგვიკავშირდეთ:
            </p>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
              <p class="text-gray-700 dark:text-gray-300">
                <strong>ელფოსტა:</strong> support@babysitters.ge<br>
                <strong>მისამართი:</strong> თბილისი, საქართველო
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`
const lastUpdated = '2024-01-15'
const pageTitle = 'გამოყენების პირობები'
const pageDescription = 'გამოყენების პირობები - წესები და პირობები, რომლებიც არეგულირებს ჩვენი პლატფორმის გამოყენებას.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: 'ka',
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

