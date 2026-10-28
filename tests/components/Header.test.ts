import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import Header from '../../app/components/global/Header.vue'
import { UserRole } from '../../app/const/roles'

type HeaderTestOptions = {
  isAuthenticated?: boolean
  locales?: Array<{ code: string; name: string }>
  path?: string
  colorMode?: 'light' | 'dark'
}

const createHeaderMount = (options: HeaderTestOptions = {}) => {
  const navigateTo = vi.fn()
  const setLocale = vi.fn()
  const localePath = (path: string) => `/ru${path === '/' ? '' : path}`
  const route = reactive({ path: options.path ?? '/ru', fullPath: options.path ?? '/ru' })
  const colorMode = reactive({ value: options.colorMode ?? 'light', preference: options.colorMode ?? 'light' })

  const authStore = {
    isAuthenticated: options.isAuthenticated ?? false,
    currentUser: options.isAuthenticated
      ? { name: 'Jane Doe', avatar: '/avatar.jpg', role: UserRole.PARENT }
      : null,
    loadAvatarUrl: vi.fn(),
    logout: vi.fn(),
  }

  vi.stubGlobal('computed', computed)
  vi.stubGlobal('ref', ref)
  vi.stubGlobal('watch', watch)
  vi.stubGlobal('onMounted', onMounted)
  vi.stubGlobal('onBeforeUnmount', onBeforeUnmount)
  vi.stubGlobal('navigateTo', navigateTo)
  vi.stubGlobal('useLocalePath', () => localePath)
  vi.stubGlobal('useRoute', () => route)
  vi.stubGlobal('useColorMode', () => colorMode)
  vi.stubGlobal('useAuthStore', () => authStore)
  vi.stubGlobal('useI18n', () => ({
    locale: ref('ru'),
    locales: ref(options.locales ?? [{ code: 'ru', name: 'Русский' }, { code: 'en', name: 'English' }]),
    t: (key: string) => `t:${key}`,
    setLocale,
  }))

  const wrapper = mount(Header, {
    global: {
      stubs: {
        ClientOnly: defineComponent({
          setup(_, { slots }) {
            return () => h('div', slots.default?.())
          },
        }),
        NuxtLink: defineComponent({
          props: {
            to: { type: String, required: false },
          },
          setup(props, { slots }) {
            return () => h('a', { href: props.to }, slots.default?.())
          },
        }),
        UIcon: true,
        UDropdownMenu: defineComponent({
          name: 'UDropdownMenu',
          props: {
            items: { type: Array, required: true },
          },
          setup(_, { slots }) {
            return () => h('div', { 'data-test': 'dropdown' }, slots.default?.())
          },
        }),
      },
    },
  })

  return {
    wrapper,
    authStore,
    colorMode,
    navigateTo,
    setLocale,
  }
}

const dropdowns = (wrapper: ReturnType<typeof mount>) => wrapper.findAllComponents({ name: 'UDropdownMenu' })

describe('Header', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders guest state: nav links and login button', () => {
    const { wrapper, authStore } = createHeaderMount({ isAuthenticated: false })
    const nav = wrapper.find('nav.nav')

    expect(authStore.loadAvatarUrl).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.brand').text()).toBe('Sitter.ge')
    expect(nav.findAll('a').map(a => a.attributes('href'))).toEqual(['/ru/search', '/ru/kak-stat-bebisitterom', '/ru/blog'])
    expect(nav.text()).toContain('t:header.findSitter')
    expect(wrapper.find('.hdr-right a.btn').attributes('href')).toBe('/ru/login')
    expect(wrapper.find('.acc').exists()).toBe(false)
  })

  it('highlights the main action on home and the current section elsewhere', () => {
    const home = createHeaderMount({ path: '/ru' })
    expect(home.wrapper.find('nav.nav a.on').attributes('href')).toBe('/ru/search')
    vi.unstubAllGlobals()

    const blog = createHeaderMount({ path: '/ru/blog/some-article' })
    expect(blog.wrapper.find('nav.nav a.on').attributes('href')).toBe('/ru/blog')
  })

  it('renders authenticated state: account menu instead of login', () => {
    const { wrapper } = createHeaderMount({ isAuthenticated: true })
    const account = dropdowns(wrapper).at(-1)!

    expect(wrapper.find('.hdr-right a.btn').exists()).toBe(false)
    expect(wrapper.find('.acc img').attributes('alt')).toBe('Jane Doe')

    const items = account.props('items') as any[]
    expect(items[0][0].label).toBe('Jane Doe')
    expect(items[1].map((item: any) => item.to)).toEqual(['/ru/account/profile', '/ru/account/orders', '/ru/account/messages'])
    expect(items[2][0].label).toBe('t:header.logout')
  })

  it('changes locale from the language menu and the mobile menu', async () => {
    const { wrapper, setLocale } = createHeaderMount()
    const items = dropdowns(wrapper).at(0)!.props('items') as any[]

    items[1].onSelect()
    expect(setLocale).toHaveBeenCalledWith('en')

    await wrapper.find('#site-mnav .langs button:last-child').trigger('click')
    expect(setLocale).toHaveBeenCalledTimes(2)
  })

  it('runs logout action from account menu item', () => {
    const { wrapper, authStore, navigateTo } = createHeaderMount({ isAuthenticated: true })
    const items = dropdowns(wrapper).at(-1)!.props('items') as any[]

    items[2][0].onSelect()

    expect(authStore.logout).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith('/ru')
  })

  it('toggles theme and mobile menu', async () => {
    const { wrapper, colorMode } = createHeaderMount({ colorMode: 'light' })

    await wrapper.find('.iconbtn:not(.burger)').trigger('click')
    expect(colorMode.preference).toBe('dark')

    const burger = wrapper.find('.burger')
    await burger.trigger('click')
    expect(burger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('#site-mnav').classes()).toContain('open')
  })

  it('hides language switch when locales list is empty', () => {
    const { wrapper } = createHeaderMount({ locales: [] })

    expect(wrapper.find('.chipbtn').exists()).toBe(false)
    expect(wrapper.find('#site-mnav .langs').exists()).toBe(false)
  })
})
