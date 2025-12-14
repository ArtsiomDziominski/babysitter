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

interface ApiUser {
    id: number
    email: string
    role: 'parent' | 'babysitter'
    firstName: string
    lastName: string
    phone?: string
}

function mapApiRoleToFrontend(apiRole: 'parent' | 'babysitter'): 'nanny' | 'parent' {
    return apiRole === 'babysitter' ? 'nanny' : apiRole
}

function mapFrontendRoleToApi(frontendRole: 'nanny' | 'parent'): 'parent' | 'babysitter' {
    return frontendRole === 'nanny' ? 'babysitter' : frontendRole
}

function mapApiUserToFrontend(apiUser: ApiUser): User {
    return {
        id: apiUser.id,
        name: apiUser.firstName,
        surname: apiUser.lastName,
        email: apiUser.email,
        phone: apiUser.phone || '',
        role: mapApiRoleToFrontend(apiUser.role),
    }
}

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null)
    const isAuth = ref(false)
    const user = ref<User>({
        id: 0,
        name: '',
        surname: '',
        email: '',
        phone: '',
        role: 'parent',
    })

    if (process.client) {
        const savedToken = localStorage.getItem('access_token')
        if (savedToken) {
            accessToken.value = savedToken
        }
    }

    const isAuthenticated = computed(() => isAuth.value && !!accessToken.value)
    const currentUser = computed(() => user.value)

    function setToken(token: string | null) {
        accessToken.value = token
        if (process.client) {
            if (token) {
                localStorage.setItem('access_token', token)
            } else {
                localStorage.removeItem('access_token')
            }
        }
    }

    function setAuth(value: boolean) {
        isAuth.value = value
    }

    function setUser(newUser: User) {
        user.value = newUser
    }

    function setRole(role: 'nanny' | 'parent') {
        user.value.role = role
    }

    async function login(email: string, password: string) {
        const api = useApi()
        try {
            const response = await api.login({ email, password })
            setToken(response.access_token)
            const mappedUser = mapApiUserToFrontend(response.user as ApiUser)
            setUser(mappedUser)
            setAuth(true)
            return response
        } catch (error) {
            throw error
        }
    }

    async function register(data: {
        email: string
        password: string
        firstName: string
        lastName: string
        phone: string
        role: 'nanny' | 'parent'
    }) {
        const api = useApi()
        try {
            const apiRole = mapFrontendRoleToApi(data.role)
            const response = await api.register({
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                role: apiRole,
            })
            setToken(response.access_token)
            const mappedUser = mapApiUserToFrontend(response.user as ApiUser)
            setUser(mappedUser)
            setAuth(true)
            return response
        } catch (error) {
            throw error
        }
    }

    function logout() {
        setToken(null)
        setAuth(false)
        user.value = {
            id: 0,
            name: '',
            surname: '',
            email: '',
            phone: '',
            role: 'parent',
            children: []
        }
    }

    return {
        accessToken,
        isAuth,
        user,
        isAuthenticated,
        currentUser,
        setAuth,
        setUser,
        setRole,
        setToken,
        login,
        register,
        logout
    }
})