import { useTranslation } from 'react-i18next'

import { useSearchFiltersStore } from '../../../shared/store/useSearchFiltersStore'
import { FilterModal } from './FilterModal'

export const App = () => {
	const { t } = useTranslation('filter')
	const { open, selected } = useSearchFiltersStore()

	return (
		<main className="w-full min-h-dvh flex flex-col items-center gap-6 p-6">
			{/* eslint-disable-next-line i18next/no-literal-string */}
			<h1 className="text-4xl text-gray-700 text-center">
				WinWinTravel frontend test task
			</h1>

			<button
				type="button"
				aria-haspopup="dialog"
				onClick={() => open()}
				className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
			>
				{t('openFilters')}
			</button>

			<section className="w-full max-w-2xl">
				<h2 className="sr-only">{t('debugSelected')}</h2>
				<pre className="rounded-lg bg-gray-100 p-3 text-sm overflow-auto">
					{JSON.stringify(selected, null, 2)}
				</pre>
			</section>

			<FilterModal />
		</main>
	)
}
