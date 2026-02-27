import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import Header from '../../app/components/global/Header.vue'
import { UserRole } from '../../app/const/roles'

type HeaderTestOptions = {
  isAuthenticated?: boolean
  locales?: Array<{ code: string; name: string }>
}

const createHeaderMount = (options: HeaderTestOptions = {}) => {
  const navigateTo = vi.fn()
  const setLocale = vi.fn()

  const authStore = {
    isAuthenticated: options.isAuthenticated ?? false,
    currentUser: options.isAuthenticated
      ? { name: 'Jane Doe', avatar: '/avatar.jpg', role: UserRole.PARENT }
      : null,
    loadAvatarUrl: vi.fn(),
    logout: vi.fn(),
  }

  vi.stubGlobal('computed', computed)
  vi.stubGlobal('onMounted', onMounted)
  vi.stubGlobal('navigateTo', navigateTo)
  vi.stubGlobal('useAuthStore', () => authStore)
  vi.stubGlobal('useSiteConfig', () => ({
    name: 'Babysitter',
    logo: '/logo.svg',
  }))
  vi.stubGlobal('useI18n', () => ({
    locale: ref('ru'),
    locales: ref(options.locales ?? [{ code: 'ru', name: 'Русский' }]),
    t: (key: string) => `t:${key}`,
    setLocale,
  }))

  const wrapper = mount(Header, {
    global: {
      mocks: {
        $t: (key: string) => `t:${key}`,
      },
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
        UButton: defineComponent({
          props: {
            to: { type: String, required: false },
          },
          setup(props, { slots }) {
            return () =>
              h(
                'button',
                {
                  'data-test': 'login-button',
                  'data-to': props.to,
                },
                slots.default?.()
              )
          },
        }),
        USelect: defineComponent({
          props: {
            modelValue: { type: String, required: false },
            items: { type: Array, required: false },
            labelKey: { type: String, required: false },
            valueKey: { type: String, required: false },
          },
          emits: ['update:model-value'],
          setup(_, { emit }) {
            return () =>
              h(
                'button',
                {
                  'data-test': 'locale-select',
                  onClick: () => emit('update:model-value', 'en'),
                },
                'locale-select'
              )
          },
        }),
        UAvatar: defineComponent({
          props: {
            alt: { type: String, required: false },
            src: { type: String, required: false },
          },
          setup(props) {
            return () => h('img', { 'data-test': 'avatar', alt: props.alt, src: props.src })
          },
        }),
        UDropdownMenu: defineComponent({
          name: 'UDropdownMenu',
          props: {
            items: { type: Array, required: true },
            popper: { type: Object, required: false },
          },
          setup(_, { slots }) {
            return () => h('div', { 'data-test': 'account-dropdown' }, slots.default?.())
          },
        }),
        MobileMenu: defineComponent({
          name: 'MobileMenu',
          props: {
            navLinks: { type: Array, required: true },
          },
          setup(props) {
            return () => h('div', { 'data-test': 'mobile-menu', 'data-size': props.navLinks.length })
          },
        }),
      },
    },
  })

  return {
    wrapper,
    authStore,
    navigateTo,
    setLocale,
  }
}

describe('Header', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders guest state: basic nav and login button', () => {
    const { wrapper, authStore } = createHeaderMount({ isAuthenticated: false })

    expect(authStore.loadAvatarUrl).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('Babysitter')
    expect(wrapper.text()).toContain('t:header.bookings')
    expect(wrapper.text()).toContain('t:header.blog')
    expect(wrapper.text()).not.toContain('t:header.messages')
    expect(wrapper.text()).toContain('t:header.login')
    expect(wrapper.find('[data-test="account-dropdown"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="mobile-menu"]').attributes('data-size')).toBe('2')
  })

  it('renders authenticated state: messages link and account menu', () => {
    const { wrapper } = createHeaderMount({ isAuthenticated: true })
    const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })

    expect(wrapper.text()).toContain('t:header.messages')
    expect(wrapper.find('[data-test="login-button"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="avatar"]').attributes('alt')).toBe('Jane Doe')
    expect(wrapper.find('[data-test="mobile-menu"]').attributes('data-size')).toBe('3')
    expect(dropdown.exists()).toBe(true)

    const items = dropdown.props('items') as any[]
    expect(items[0][0].label).toBe('Jane Doe')
    expect(items[1].map(item => item.to)).toEqual(['/account/profile', '/account/orders', '/account/messages'])
    expect(items[2][0].label).toBe('t:header.logout')
  })

  it('changes locale via locale select', async () => {
    const { wrapper, setLocale } = createHeaderMount({ isAuthenticated: false })

    await wrapper.find('[data-test="locale-select"]').trigger('click')
    expect(setLocale).toHaveBeenCalledWith('en')
  })

  it('runs logout action from account menu item', () => {
    const { wrapper, authStore, navigateTo } = createHeaderMount({ isAuthenticated: true })
    const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
    const items = dropdown.props('items') as any[]
    const logoutItem = items[2][0]

    logoutItem.onSelect()

    expect(authStore.logout).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith('/')
  })

  it('hides locale select when locales list is empty', () => {
    const { wrapper } = createHeaderMount({ locales: [] })

    expect(wrapper.find('[data-test="locale-select"]').exists()).toBe(false)
  })
})
