import { useQuery } from '@tanstack/react-query'

import type { FilterItem } from '../api/types/Filter'

type FilterResponse = { filterItems: FilterItem[] }

export const useFilterData = () => {
	return useQuery({
		queryKey: ['filterData'],
		queryFn: async (): Promise<FilterItem[]> => {
			const res = await fetch('/filterData.json', { cache: 'no-store' })
			if (!res.ok) {
				throw new Error('Failed to load filterData.json')
			}

			const json = (await res.json()) as FilterResponse | FilterItem[]

			const items = Array.isArray(json) ? json : json?.filterItems
			return Array.isArray(items) ? items : []
		},
		staleTime: 5 * 60 * 1000
	})
}
