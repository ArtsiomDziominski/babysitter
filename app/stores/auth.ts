import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ApiUser } from '~/composables/useApi'
import { UserRole, type Role } from '~/const/roles'

export interface User {
    id: number
    name: string
    surname?: string
    email: string
    phone: string
    city?: string
    avatar?: string
    avatarUrl?: string
    role: Role
    children?: any[]
    babysitter?: any | null
}

function mapApiUserToFrontend(apiUser: ApiUser): User {
    return {
        id: apiUser.id,
        name: apiUser.firstName,
        surname: apiUser.lastName,
        email: apiUser.email,
        phone: apiUser.phone || '',
        avatar: apiUser.avatar,
        avatarUrl: apiUser.avatarUrl,
        role: apiUser.role === UserRole.PARENT ? UserRole.PARENT : apiUser.role === UserRole.BABYSITTER ? UserRole.BABYSITTER : null,
        children: apiUser.children || undefined,
    }
}

export const useAuthStore = defineStore('auth', () => {
    const tokenCookie = useCookie<string | null>('access_token', {
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false
    })

    const accessToken = ref<string | null>(tokenCookie.value)
    const isAuth = ref(false)
    const user = ref<User>({
        id: 0,
        name: '',
        surname: '',
        email: '',
        phone: '',
        role: null,
        children: [],
        babysitter: null,
    })

    const isAuthenticated = computed(() => isAuth.value && !!accessToken.value)
    const currentUser = computed(() => user.value)

    function setToken(token: string | null) {
        accessToken.value = token
        tokenCookie.value = token
    }

    function setAuth(value: boolean) {
        isAuth.value = value
    }

    function setUser(newUser: User) {
        user.value = newUser
    }

    function setRole(role: Role) {
        user.value.role = role
    }

    function setChildren(children: any[]) {
        user.value.children = children
    }

    async function loadAvatarUrl() {
        if (!process.client) return
        const avatar = user.value?.avatar
        if (!avatar || avatar.startsWith('http')) {
            return
        }

        try {
            const profile = useProfile()
            const url = await profile.getAvatarUrl(accessToken.value)
            if (url && user.value) {
                user.value.avatar = url
            }
        } catch (error) {
            console.warn('Не удалось получить presigned URL аватара:', error)
        }
    }

    async function fetchProfile() {
        const auth = useAuth()
        try {
            const response = await auth.getProfile()
            const mappedUser = mapApiUserToFrontend(response.data as ApiUser)
            setUser(mappedUser)
            await loadAvatarUrl()
            setAuth(true)
            return mappedUser
        } catch (error) {
            setToken(null)
            setAuth(false)
            throw error
        }
    }

    async function restoreAuth() {
        if (!accessToken.value) {
            return false
        }
        try {
            await fetchProfile()
            return true
        } catch (error) {
            return false
        }
    }

    async function login(email: string, password: string) {
        const auth = useAuth()
        try {
            const response = await auth.login({ email, password })
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
        role?: Role
    }) {
        const auth = useAuth()
        try {
            const response = await auth.register({
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                ...(data.role ? { role: data.role } : {}),
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

    async function saveRole(role: UserRole) {
        const profile = useProfile()
        if (!role) {
            throw new Error('Role is required')
        }

        const updatedUser = await profile.updateRole(role)
        const mappedUser = mapApiUserToFrontend(updatedUser as ApiUser)
        setUser(mappedUser)
        setAuth(true)
        return mappedUser
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
            role: null,
            children: [],
            babysitter: null,
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
        setChildren,
        loadAvatarUrl,
        fetchProfile,
        restoreAuth,
        login,
        register,
        saveRole,
        logout
    }
})
