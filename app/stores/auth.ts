import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
    id: number
    name: string
    surname?: string
    email: string
    phone: string
    city?: string
    avatar?: string
    role: 'nanny' | 'parent'
    children?: Array<{
        name: string
        age: string
        gender: string
        notes: string
    }>
}

export const useAuthStore = defineStore('auth', () => {
    const isAuth = ref(true)
    const user = ref<User>({
        id: 1,
        name: 'Артем',
        surname: 'Дз',
        email: 'ivan@example.com',
        phone: '+7',
        city: 'minsk',
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
            surname: '',
            email: '',
            phone: '',
            city: '',
            role: 'parent',
            children: []
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

