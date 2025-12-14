<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t('account.orders.title') }}
    </h1>

    <div v-if="orders.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">
        {{ $t('account.orders.empty') }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ order.sitterName }}
              </h3>
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="getStatusClass(order.status)"
              >
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span class="font-medium">{{ $t('account.orders.date') }}:</span>
                {{ formatDate(order.date) }}
              </p>
              <p>
                <span class="font-medium">{{ $t('account.orders.time') }}:</span>
                {{ order.time }}
              </p>
              <p v-if="order.children.length > 0">
                <span class="font-medium">{{ $t('account.orders.children') }}:</span>
                {{ order.children.join(', ') }}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ order.price }} ₽
            </span>
            <div class="flex gap-2">
              <!-- pending: Отменить -->
              <UButton
                v-if="order.status === 'pending'"
                size="sm"
                color="red"
                variant="outline"
                @click="handleAction(order.id, 'cancel')"
              >
                {{ $t('account.orders.actions.cancel') }}
              </UButton>

              <!-- confirmed: Отменить, Связаться -->
              <template v-if="order.status === 'confirmed'">
                <UButton
                  size="sm"
                  color="red"
                  variant="outline"
                  @click="handleAction(order.id, 'cancel')"
                >
                  {{ $t('account.orders.actions.cancel') }}
                </UButton>
                <UButton
                  size="sm"
                  color="primary"
                  @click="handleAction(order.id, 'contact')"
                >
                  {{ $t('account.orders.actions.contact') }}
                </UButton>
              </template>

              <!-- in_progress: Связаться, Отменить -->
              <template v-if="order.status === 'in_progress'">
                <UButton
                  size="sm"
                  color="primary"
                  @click="handleAction(order.id, 'contact')"
                >
                  {{ $t('account.orders.actions.contact') }}
                </UButton>
                <UButton
                  size="sm"
                  color="red"
                  variant="outline"
                  @click="handleAction(order.id, 'cancel')"
                >
                  {{ $t('account.orders.actions.cancel') }}
                </UButton>
              </template>

              <!-- completed: Оставить отзыв, Повторить заказ -->
              <template v-if="order.status === 'completed'">
                <UButton
                  size="sm"
                  variant="outline"
                  @click="handleAction(order.id, 'review')"
                >
                  {{ $t('account.orders.actions.review') }}
                </UButton>
                <UButton
                  size="sm"
                  color="primary"
                  @click="handleAction(order.id, 'repeat')"
                >
                  {{ $t('account.orders.actions.repeat') }}
                </UButton>
              </template>

              <!-- cancelled: Повторить заказ -->
              <UButton
                v-if="order.status === 'cancelled'"
                size="sm"
                color="primary"
                @click="handleAction(order.id, 'repeat')"
              >
                {{ $t('account.orders.actions.repeat') }}
              </UButton>

              <!-- rejected: Найти другого -->
              <UButton
                v-if="order.status === 'rejected'"
                size="sm"
                color="primary"
                @click="handleAction(order.id, 'findAnother')"
              >
                {{ $t('account.orders.actions.findAnother') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

interface Order {
  id: string
  sitterName: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected'
  date: string
  time: string
  children: string[]
  price: number
}

const orders = ref<Order[]>([
  {
    id: '1',
    sitterName: 'Анна Петрова',
    status: 'confirmed',
    date: '2024-01-15',
    time: '10:00 - 14:00',
    children: ['Мария'],
    price: 2000
  },
  {
    id: '2',
    sitterName: 'Елена Смирнова',
    status: 'pending',
    date: '2024-01-20',
    time: '09:00 - 17:00',
    children: ['Иван', 'София'],
    price: 3500
  },
  {
    id: '3',
    sitterName: 'Мария Иванова',
    status: 'in_progress',
    date: '2024-01-18',
    time: '08:00 - 16:00',
    children: ['Алексей'],
    price: 2800
  },
  {
    id: '4',
    sitterName: 'Ольга Сидорова',
    status: 'completed',
    date: '2024-01-10',
    time: '12:00 - 18:00',
    children: ['Дарья'],
    price: 2400
  },
  {
    id: '5',
    sitterName: 'Татьяна Козлова',
    status: 'rejected',
    date: '2024-01-22',
    time: '10:00 - 14:00',
    children: ['Максим'],
    price: 2000
  }
])

const getStatusClass = (status: Order['status']) => {
  const classes = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    in_progress: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    cancelled: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  }
  return classes[status]
}

const getStatusText = (status: Order['status']) => {
  const { t } = useI18n()
  const statusMap = {
    pending: t('account.orders.status.pending'),
    confirmed: t('account.orders.status.confirmed'),
    in_progress: t('account.orders.status.in_progress'),
    completed: t('account.orders.status.completed'),
    cancelled: t('account.orders.status.cancelled'),
    rejected: t('account.orders.status.rejected')
  }
  return statusMap[status]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleAction = (orderId: string, action: string) => {
  console.log(`Action ${action} for order ${orderId}`)
}
</script>

