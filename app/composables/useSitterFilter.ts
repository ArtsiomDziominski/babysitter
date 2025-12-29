import type { Sitter, SearchFilters } from '~/types/sitter'

export const useSitterFilter = (
  sitters: Ref<Sitter[]>,
  filters: Ref<SearchFilters>,
  sortBy: Ref<string>
) => {
  const filteredSitters = computed(() => {
    let result = [...sitters.value]

    if (filters.value.onlyOnline) {
      result = result.filter(s => s.isOnline)
    }

    if (filters.value.priceMin !== undefined) {
      result = result.filter(s => s.price >= filters.value.priceMin!)
    }

    if (filters.value.priceMax !== undefined) {
      result = result.filter(s => s.price <= filters.value.priceMax!)
    }

    const activeAdvantages = Object.entries(filters.value.advantages)
      .filter(([_, value]) => value)
      .map(([key]) => key)

    if (activeAdvantages.length > 0) {
      result = result.filter(s =>
        activeAdvantages.some(adv => s.advantages.includes(adv))
      )
    }

    if (sortBy.value === 'priceAsc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy.value === 'priceDesc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy.value === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy.value === 'newest') {
      result.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1
        return 0
      })
    }

    return result
  })

  return {
    filteredSitters
  }
}
