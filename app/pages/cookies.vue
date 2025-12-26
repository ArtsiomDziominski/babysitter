<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Cookies პოლიტიკა
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
              ეს Cookies პოლიტიკა აღწერს, თუ როგორ ვიყენებთ cookies-ს და მსგავს ტექნოლოგიებს ჩვენს პლატფორმაზე. 
              ეს პოლიტიკა განმარტავს, რა ტიპის cookies-ს ვიყენებთ, როგორ ვიყენებთ მათ და როგორ შეგიძლიათ 
              მართოთ თქვენი პრეფერენსები cookies-ების მიმართ.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. რა არის Cookies?
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Cookies არის პატარა ტექსტური ფაილები, რომლებიც ინახება თქვენს მოწყობილობაზე (კომპიუტერი, 
              ტაბლეტი ან სმარტფონი), როდესაც თქვენ სტუმრობთ ვებსაიტს. Cookies-ები საშუალებას გვაძლევს 
              ვებსაიტს დაიმახსოვროს თქვენი მოქმედებები და პრეფერენსები გარკვეული პერიოდის განმავლობაში, 
              ასე რომ თქვენ არ გჭირდებათ მათი ხელახლა შეყვანა ყოველ ჯერზე, როდესაც ბრუნდებით საიტზე ან 
              გადადიხართ გვერდიდან გვერდზე.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. რა ტიპის Cookies-ს ვიყენებთ?
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ჩვენ ვიყენებთ შემდეგ ტიპის cookies-ს:
            </p>
            
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              3.1. აუცილებელი Cookies
            </h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ეს cookies-ები აუცილებელია ვებსაიტის ფუნქციონირებისთვის და არ შეიძლება გამორთული იყოს ჩვენს 
              სისტემებში. ისინი ჩვეულებრივ დაყენებულია მხოლოდ თქვენი მოქმედებების საპასუხოდ, როგორიცაა 
              მოთხოვნის გაგზავნა, უსაფრთხოების პარამეტრების დაყენება, შესვლა ან ფორმის შევსება.
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>სესიის cookies-ები: ინახავს ინფორმაციას თქვენი სესიის შესახებ</li>
              <li>უსაფრთხოების cookies-ები: უზრუნველყოფს პლატფორმის უსაფრთხოებას</li>
              <li>ავტორიზაციის cookies-ები: ინახავს თქვენი შესვლის ინფორმაციას</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              3.2. ფუნქციონალური Cookies
            </h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ეს cookies-ები საშუალებას გვაძლევს გავაუმჯობესოთ ვებსაიტის ფუნქციონალობა და პერსონალიზაცია. 
              ისინი შეიძლება დაყენებული იყოს ჩვენი მიერ ან მესამე მხარის მიერ, რომლის სერვისებსაც ჩვენ 
              ვამატებთ ჩვენს გვერდებზე.
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>პრეფერენსების cookies-ები: ინახავს თქვენს პრეფერენსებს (მაგ. ენა, რეგიონი)</li>
              <li>პერსონალიზაციის cookies-ები: იმახსოვრებს თქვენს არჩევანს პერსონალიზებული გამოცდილებისთვის</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              3.3. ანალიტიკური Cookies
            </h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ეს cookies-ები საშუალებას გვაძლევს დავთვალოთ ვიზიტები და წყაროები ტრაფიკის, რათა გავაუმჯობესოთ 
              ჩვენი საიტის მუშაობა. ისინი გვეხმარებიან გავიგოთ, რომელი გვერდები ყველაზე პოპულარულია და როგორ 
              მოძრაობენ მომხმარებლები საიტზე.
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>ვიზიტების ანალიტიკა: რომელი გვერდები ყველაზე ხშირად სტუმრობენ</li>
              <li>მომხმარებლის ქცევის ანალიტიკა: როგორ იყენებენ მომხმარებლები პლატფორმას</li>
              <li>პროდუქტიულობის ანალიტიკა: საიტის სიჩქარისა და მუშაობის მონიტორინგი</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              3.4. მარკეტინგული Cookies
            </h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ეს cookies-ები შეიძლება დაყენებული იყოს ჩვენი რეკლამის პარტნიორების მიერ ჩვენს საიტზე, რათა 
              შევქმნათ თქვენი პროფილი და გაჩვენოთ რეკლამები, რომლებიც შეესაბამება თქვენს ინტერესებს სხვა 
              საიტებზე. ისინი ასევე გამოიყენება ჩვენი რეკლამის ეფექტურობის შესაფასებლად.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. როგორ ვიყენებთ Cookies-ს?
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ჩვენ ვიყენებთ cookies-ს შემდეგი მიზნებისთვის:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>პლატფორმის ფუნქციონალობის უზრუნველყოფა: cookies-ები საშუალებას გვაძლევს გავაუმჯობესოთ 
                მომხმარებლის გამოცდილება და უზრუნველვყოთ პლატფორმის სწორი მუშაობა</li>
              <li>ავტორიზაცია და უსაფრთხოება: cookies-ები გვეხმარება დავიცვათ თქვენი ანგარიში და პირადი ინფორმაცია</li>
              <li>პერსონალიზაცია: cookies-ები საშუალებას გვაძლევს გავაუმჯობესოთ თქვენი გამოცდილება პლატფორმაზე</li>
              <li>ანალიტიკა: cookies-ები გვეხმარება გავიგოთ, როგორ იყენებენ მომხმარებლები პლატფორმას და 
                როგორ შევძლოთ მისი გაუმჯობესება</li>
              <li>რეკლამა: cookies-ები გამოიყენება რეკლამების ჩვენებისთვის, რომლებიც შეესაბამება თქვენს ინტერესებს</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Cookies-ების მართვა
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              თქვენ გაქვთ კონტროლი cookies-ებზე. თქვენ შეგიძლიათ დააყენოთ თქვენი ბრაუზერი, რათა უარი 
              თქვათ cookies-ებზე ან შეტყობინოთ, როდესაც cookies-ები იგზავნება. თუმცა, გაითვალისწინეთ, 
              რომ ზოგიერთი cookies-ის გამორთვა შეიძლება გავლენა მოახდინოს ვებსაიტის ფუნქციონალობაზე.
            </p>
            
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              5.1. ბრაუზერის პარამეტრები
            </h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              თქვენ შეგიძლიათ მართოთ cookies-ები თქვენი ბრაუზერის პარამეტრებით. უმეტეს ბრაუზერებში შეგიძლიათ:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>ნახოთ რა cookies-ები გაქვთ და წაშალოთ ისინი</li>
              <li>დაბლოკოთ cookies-ები მომავლისთვის</li>
              <li>დაბლოკოთ cookies-ები კონკრეტული საიტებიდან</li>
              <li>დაბლოკოთ მესამე მხარის cookies-ები</li>
              <li>წაშალოთ ყველა cookies-ები, როდესაც დახურავთ ბრაუზერს</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              5.2. Cookies-ების გამორთვის შედეგები
            </h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              თუ თქვენ გამორთავთ cookies-ებს, ზოგიერთი ფუნქცია შეიძლება არ იმუშაოს სწორად:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>შესაძლოა დაგჭირდეთ ხელახლა შესვლა ყოველ ჯერზე, როდესაც სტუმრობთ საიტს</li>
              <li>შესაძლოა დაკარგოთ თქვენი პრეფერენსები და პერსონალიზაცია</li>
              <li>ზოგიერთი ფუნქცია შეიძლება არ იმუშაოს ან იმუშაოს შეზღუდულად</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. მესამე მხარის Cookies
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ზოგიერთ შემთხვევაში, ჩვენ ვიყენებთ cookies-ებს, რომლებიც მოწოდებულია სანდო მესამე მხარის 
              პარტნიორების მიერ. ქვემოთ ჩამოთვლილია მესამე მხარის cookies-ების ტიპები, რომლებსაც შეიძლება 
              შევხვდეთ ჩვენს საიტზე:
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>ანალიტიკის სერვისები: cookies-ები, რომლებიც გამოიყენება ვებსაიტის ანალიტიკისთვის</li>
              <li>რეკლამის სერვისები: cookies-ები, რომლებიც გამოიყენება რეკლამების ჩვენებისთვის</li>
              <li>სოციალური მედია: cookies-ები, რომლებიც გამოიყენება სოციალური მედიის ფუნქციებისთვის</li>
            </ul>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              გთხოვთ, გაითვალისწინოთ, რომ ჩვენ არ გვაქვს კონტროლი მესამე მხარის cookies-ებზე. თუ გსურთ 
              მართოთ ეს cookies-ები, გთხოვთ, მიმართოთ შესაბამის მესამე მხარის პოლიტიკებს.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Cookies-ების ხანგრძლივობა
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Cookies-ები შეიძლება იყოს "სესიის" ან "მუდმივი" cookies-ები. სესიის cookies-ები დროებითია 
              და იშლება, როდესაც თქვენ დახურავთ ბრაუზერს. მუდმივი cookies-ები რჩება თქვენს მოწყობილობაზე 
              განსაზღვრული პერიოდის განმავლობაში ან სანამ არ წაშლით მათ ხელით.
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
              <li>სესიის cookies-ები: იშლება ბრაუზერის დახურვისას</li>
              <li>მუდმივი cookies-ები: რჩება განსაზღვრული პერიოდის განმავლობაში (მაგ. 30 დღე, 1 წელი)</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. პოლიტიკის ცვლილებები
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              ჩვენ შეიძლება დროდადრო განვაახლოთ ეს Cookies პოლიტიკა, რათა ასახოს ჩვენი პრაქტიკის ცვლილებები 
              ან სხვა ოპერაციული, იურიდიული ან რეგულაციური მიზეზების გამო. ჩვენ განვაახლებთ "ბოლო განახლების" 
              თარიღს ამ პოლიტიკის ზედა ნაწილში და შეგატყობინებთ მნიშვნელოვან ცვლილებებზე.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. კონტაქტი
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              თუ თქვენ გაქვთ შეკითხვები ამ Cookies პოლიტიკასთან დაკავშირებით ან გსურთ მართოთ თქვენი cookies-ების 
              პრეფერენსები, გთხოვთ დაგვიკავშირდეთ:
            </p>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
              <p class="text-gray-700 dark:text-gray-300">
                <strong>ელფოსტა:</strong> privacy@babysitters.ge<br>
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
const { locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`
const lastUpdated = '2024-01-15'
const pageTitle = 'Cookies პოლიტიკა'
const pageDescription = 'Cookies პოლიტიკა - ინფორმაცია იმის შესახებ, თუ როგორ ვიყენებთ cookies-ს ჩვენს პლატფორმაზე და როგორ შეგიძლიათ მართოთ თქვენი პრეფერენსები.'

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

