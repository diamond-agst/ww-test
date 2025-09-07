import { create } from 'zustand'

import type { SearchRequestFilter } from '../../shared/api/types/SearchRequest/SearchRequestFilter'

type SelectedGroup = { id: string; values: string[] }

type State = {
	isOpen: boolean
	selected: SearchRequestFilter
	draft: SearchRequestFilter
}
type Actions = {
	open: (prefill?: SearchRequestFilter) => void
	close: () => void
	reset: () => void
	apply: () => void
	toggle: (groupId: string, valueId: string) => void
	clearDraft: () => void
}

export const useSearchFiltersStore = create<State & Actions>()(set => ({
	isOpen: false,
	selected: [] as SearchRequestFilter,
	draft: [] as SearchRequestFilter,

	open: (prefill?: SearchRequestFilter) =>
		set(state => ({ isOpen: true, draft: prefill ?? state.selected })),

	close: () => set({ isOpen: false }),

	reset: () => set(state => ({ draft: state.selected })),

	apply: () => set(state => ({ selected: state.draft, isOpen: false })),

	toggle: (groupId, valueId) =>
		set(state => {
			const arr: SelectedGroup[] = (
				state.draft as unknown as SelectedGroup[]
			).map(group => ({ ...group }))
			const i = arr.findIndex(group => group.id === groupId)

			if (i === -1) {
				arr.push({ id: groupId, values: [valueId] })
			} else {
				const valueSet = new Set(arr[i].values ?? [])
				valueSet.has(valueId) ? valueSet.delete(valueId) : valueSet.add(valueId)
				const next = Array.from(valueSet)
				if (next.length === 0) {
					arr.splice(i, 1)
				} else {
					arr[i] = { ...arr[i], values: next }
				}
			}

			return { draft: arr as unknown as SearchRequestFilter }
		}),

	clearDraft: () => set({ draft: [] as SearchRequestFilter })
}))
