import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, nextTick as vueNextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import PriceMenu from '../../app/components/search/PriceMenu.vue'

describe('PriceMenu', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
  })

  it('shows detailed menu on hover', async () => {
    vi.stubGlobal('ref', ref)
    vi.stubGlobal('computed', computed)
    vi.stubGlobal('watch', watch)
    vi.stubGlobal('onMounted', onMounted)
    vi.stubGlobal('onUnmounted', onUnmounted)
    vi.stubGlobal('nextTick', vueNextTick)
    vi.stubGlobal('useSiteConfig', () => ({ currency: '₾' }))

    const wrapper = mount(PriceMenu, {
      attachTo: document.body,
      props: {
        priceOneChild: '20',
        priceTwoChildren: '30',
        onlineLesson: '15',
        minOrderAmount: '50',
      },
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: {
          Teleport: false,
        },
      },
    })

    expect(wrapper.text()).toContain('20 ₾')

    wrapper.element.dispatchEvent(new Event('mouseenter'))
    await vueNextTick()
    await vueNextTick()

    const bodyText = document.body.textContent || ''
    expect(bodyText).toContain('2 ребенка:')
    expect(bodyText).toContain('30 ₾/час')
    expect(bodyText).toContain('Онлайн урок:')
    expect(bodyText).toContain('15 ₾/час')
    expect(bodyText).toContain('Минимальный заказ:')
    expect(bodyText).toContain('50 ₾')

    wrapper.unmount()
  })
})
