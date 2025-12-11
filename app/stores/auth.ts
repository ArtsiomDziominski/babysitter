import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  phone: string
  avatar?: string
  role: 'nanny' | 'parent'
}

export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref(true)
  const user = ref<User>({
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+375 29 123-45-67',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'parent'
  })

  const isAuthenticated = computed(() => isAuth.value)
  const currentUser = computed(() => user.value)

  function setAuth(value: boolean) {
    isAuth.value = value
  }

  function setUser(newUser: User) {
    user.value = newUser
  }

  function logout() {
    isAuth.value = false
    user.value = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      role: 'parent'
    }
  }

  return {
    isAuth,
    user,
    isAuthenticated,
    currentUser,
    setAuth,
    setUser,
    logout
  }
})

