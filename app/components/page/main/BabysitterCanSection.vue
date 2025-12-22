<script setup lang="ts">
const services = [
  {
    text: 'Посидеть с ребенком, пока вас нет дома',
    icon: 'mdi:home-heart'
  },
  {
    text: 'Отвезти ребенка на занятия, к репетитору, в спортивную секцию',
    icon: null
  },
  {
    text: 'Проводить ребенка домой из школы, или сада',
    icon: null
  },
  {
    text: 'Помочь с детьми на дне рождения, семейном празднике',
    icon: 'mdi:party-popper'
  },
  {
    text: 'Развлечь ребенка в торговом или спортивном центре, пока вы заняты',
    icon: null
  },
  {
    text: 'Отвезти ребенка к бабушкам или другим родственникам',
    icon: null
  },
  {
    text: 'Отвлечь ребенка, пока вы заняты домашними делами',
    icon: 'mdi:toys'
  }
]
</script>

<template>
  <section class="py-20 bg-gray-50 dark:bg-gray-800">
    <UContainer>
      <h2 class="text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        Бебиситтер может
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(service, index) in services"
          :key="index"
          :class="[
            'p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow',
            index === 3 ? 'md:col-start-1 md:col-span-2' : '',
            index === 6 ? 'md:col-start-2 md:col-span-2' : ''
          ]"
        >
          <div v-if="service.icon" class="mb-4 flex justify-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-800 dark:to-red-800 flex items-center justify-center">
              <Icon :name="service.icon" size="32" class="text-white" />
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-300 text-center">
            {{ service.text }}
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>

