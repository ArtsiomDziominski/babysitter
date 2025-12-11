<template>
  <div class="min-h-screen py-8">
    <UContainer>
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ $t('account.title') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('account.welcome', { name: authStore.currentUser?.name }) }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-1">
            <UCard>
              <template #header>
                <div class="flex items-center gap-4">
                  <UAvatar
                    :src="authStore.currentUser?.avatar"
                    :alt="authStore.currentUser?.name"
                    size="lg"
                  />
                  <div>
                    <h3 class="font-semibold text-lg">{{ authStore.currentUser?.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ authStore.currentUser?.role === 'nanny' ? $t('account.role.nanny') : $t('account.role.parent') }}
                    </p>
                  </div>
                </div>
              </template>

              <div class="space-y-4">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ $t('account.email') }}</p>
                  <p class="font-medium">{{ authStore.currentUser?.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ $t('account.phone') }}</p>
                  <p class="font-medium">{{ authStore.currentUser?.phone }}</p>
                </div>

                <UDivider />

                <UButton
                  block
                  variant="outline"
                  @click="navigateTo('/account/settings')"
                >
                  {{ $t('account.editProfile') }}
                </UButton>
              </div>
            </UCard>
          </div>

          <div class="lg:col-span-2 space-y-6">
            <UCard v-if="authStore.currentUser?.role === 'parent'">
              <template #header>
                <h2 class="text-xl font-semibold">{{ $t('account.parent.dashboard') }}</h2>
              </template>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard class="bg-primary-50 dark:bg-primary-900/20">
                  <div class="flex items-center gap-3">
                    <div class="p-3 bg-primary-500 rounded-lg">
                      <Icon name="mdi:calendar-check" class="text-white" size="24" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.parent.activeBookings') }}</p>
                      <p class="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </UCard>

                <UCard class="bg-green-50 dark:bg-green-900/20">
                  <div class="flex items-center gap-3">
                    <div class="p-3 bg-green-500 rounded-lg">
                      <Icon name="mdi:account-heart" class="text-white" size="24" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.parent.favoriteNannies') }}</p>
                      <p class="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </UCard>

                <UCard class="bg-blue-50 dark:bg-blue-900/20">
                  <div class="flex items-center gap-3">
                    <div class="p-3 bg-blue-500 rounded-lg">
                      <Icon name="mdi:message-text" class="text-white" size="24" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.parent.messages') }}</p>
                      <p class="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </UCard>

                <UCard class="bg-purple-50 dark:bg-purple-900/20">
                  <div class="flex items-center gap-3">
                    <div class="p-3 bg-purple-500 rounded-lg">
                      <Icon name="mdi:star" class="text-white" size="24" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.parent.reviews') }}</p>
                      <p class="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </UCard>
              </div>

              <UDivider class="my-6" />

              <div class="space-y-4">
                <h3 class="font-semibold text-lg">{{ $t('account.parent.quickActions') }}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <UButton
                    block
                    color="primary"
                    @click="navigateTo('/bookings/new')"
                  >
                    <Icon name="mdi:plus" class="mr-2" />
                    {{ $t('account.parent.bookNanny') }}
                  </UButton>
                  <UButton
                    block
                    variant="outline"
                    @click="navigateTo('/nannies')"
                  >
                    <Icon name="mdi:account-search" class="mr-2" />
                    {{ $t('account.parent.findNanny') }}
                  </UButton>
                </div>
              </div>
            </UCard>

            <UCard v-else>
              <template #header>
                <h2 class="text-xl font-semibold">{{ $t('account.nanny.dashboard') }}</h2>
              </template>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard class="bg-primary-50 dark:bg-primary-900/20">
                  <div class="flex items-center gap-3">
                    <div class="p-3 bg-primary-500 rounded-lg">
                      <Icon name="mdi:calendar-check" class="text-white" size="24" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.nanny.activeBookings') }}</p>
                      <p class="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </UCard>

                <UCard class="bg-green-50 dark:bg-green-900/20">
                  <div class="flex items-center gap-3">
                    <div class="p-3 bg-green-500 rounded-lg">
                      <Icon name="mdi:account-group" class="text-white" size="24" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.nanny.clients') }}</p>
                      <p class="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </UCard>

                <UCard class="bg-blue-50 dark:bg-blue-900/20">
                  <div class="flex items-center gap-3">
                    <div class="p-3 bg-blue-500 rounded-lg">
                      <Icon name="mdi:message-text" class="text-white" size="24" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.nanny.messages') }}</p>
                      <p class="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </UCard>

                <UCard class="bg-purple-50 dark:bg-purple-900/20">
                  <div class="flex items-center gap-3">
                    <div class="p-3 bg-purple-500 rounded-lg">
                      <Icon name="mdi:star" class="text-white" size="24" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.nanny.rating') }}</p>
                      <p class="text-2xl font-bold">—</p>
                    </div>
                  </div>
                </UCard>
              </div>

              <UDivider class="my-6" />

              <div class="space-y-4">
                <h3 class="font-semibold text-lg">{{ $t('account.nanny.quickActions') }}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <UButton
                    block
                    color="primary"
                    @click="navigateTo('/account/profile/edit')"
                  >
                    <Icon name="mdi:account-edit" class="mr-2" />
                    {{ $t('account.nanny.editProfile') }}
                  </UButton>
                  <UButton
                    block
                    variant="outline"
                    @click="navigateTo('/account/schedule')"
                  >
                    <Icon name="mdi:calendar-clock" class="mr-2" />
                    {{ $t('account.nanny.manageSchedule') }}
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

definePageMeta({
  middleware: 'auth'
})
</script>

