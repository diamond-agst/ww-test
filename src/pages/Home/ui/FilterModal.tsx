import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CloseIcon from '@/shared/assets/icons/close.svg'

import { type FilterItem, FilterType } from '../../../shared/api/types/Filter'
import { useFilterData } from '../../../shared/queries/useFilterData'
import { useSearchFiltersStore } from '../../../shared/store/useSearchFiltersStore'

type SelectedGroup = { id: string; values?: string[]; selected?: string[] }

export const FilterModal = () => {
	const { t } = useTranslation('filter')
	const { data, isLoading, error } = useFilterData()
	const { isOpen, close, draft, reset, toggle, apply, clearDraft } =
		useSearchFiltersStore()

	const [confirmOpen, setConfirmOpen] = useState(false)

	useEffect(() => {
		if (!isOpen) {
			return
		}
		const prev = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = prev
		}
	}, [isOpen])

	if (!isOpen) {
		return null
	}

	const onApply = () => setConfirmOpen(true)

	const getSelectedValues = (groupId: string): string[] => {
		const sel = (draft as unknown as SelectedGroup[]).find(
			group => group.id === groupId
		)
		return sel?.values ?? sel?.selected ?? []
	}

	const renderGroup = (group: FilterItem) => {
		if (group.type !== FilterType.OPTION) {
			return null
		}
		return (
			<div
				key={group.id}
				className="pt-4 pb-4 border-b-2 border-[#B4B4B4]"
			>
				<legend className="px-1 text-xl font-medium">{group.name}</legend>

				<div className="mt-5 mb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
					{group.options.map(opt => {
						const arr = getSelectedValues(group.id)
						const checked = arr.includes(opt.id)
						return (
							<label
								key={opt.id}
								className="block px-3 cursor-pointer"
							>
								<span className="inline-flex items-start gap-2">
									<input
										type="checkbox"
										className="h-4 w-4 mt-0.5"
										checked={checked}
										onChange={() => toggle(group.id, opt.id)}
									/>
									<span className="font-normal break-words">{opt.name}</span>
								</span>
							</label>
						)
					})}
				</div>
			</div>
		)
	}

	return (
		<>
			<div
				role="dialog"
				aria-modal="true"
				className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
			>
				<section className="w-full max-w-[90%] rounded-2xl bg-white p-6 shadow-xl">
					<header className="mb-4 flex items-center justify-between border-b-2 border-[#B4B4B4] pb-3">
						<div />
						<h2 className="text-3xl text-center font-semibold">
							{t('title')}
						</h2>{' '}
						{/* <-- i18n */}
						<button
							aria-label={t('close')}
							className="rounded-lg px-2 py-1 hover:bg-gray-100"
							onClick={() => {
								reset()
								close()
							}}
						>
							<CloseIcon className="h-5 w-5 text-gray-600" />
						</button>
					</header>

					<div className="max-h-[60vh] space-y-4 overflow-auto pr-1">
						{isLoading && (
							<p className="text-sm text-gray-500">{t('loading')}</p>
						)}
						{error && <p className="text-sm text-red-600">{t('loadError')}</p>}
						{data?.map(renderGroup)}
					</div>

					<footer className="mt-6 flex justify-between gap-2">
						<div />
						<button
							className="rounded-2xl bg-[#FF5F00] px-14 py-3 text-white hover:opacity-90"
							onClick={onApply}
						>
							{t('apply')}
						</button>
						<button
							type="button"
							onClick={clearDraft}
							className="text-md text-[#078691] underline underline-offset-2 cursor-pointer rounded px-0"
						>
							{t('clearAll')}
						</button>
					</footer>
				</section>
			</div>
			{confirmOpen && (
				<div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 backdrop-blur-sm p-4">
					<section
						role="dialog"
						aria-modal="true"
						aria-labelledby="confirmTitle"
						className="relative w-full max-w-[90%] rounded-2xl bg-white p-8 shadow-2xl"
					>
						<button
							aria-label={t('close')}
							className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
							onClick={() => setConfirmOpen(false)}
						>
							<CloseIcon className="h-5 w-5 text-gray-600" />
						</button>

						<h3
							id="confirmTitle"
							className="text-4xl font-mediul text-center mb-26"
						>
							{t('confirmTitle')}
						</h3>

						<div className="flex justify-center gap-6">
							<button
								type="button"
								className="rounded-2xl border border-gray-300 px-20 py-4 text-gray-700 hover:bg-gray-50"
								onClick={() => {
									setConfirmOpen(false)
									reset()
									close()
								}}
							>
								{t('useOldFilter')}
							</button>
							<button
								type="button"
								autoFocus
								className="rounded-2xl bg-orange-500 px-20 py-4 text-white hover:bg-orange-600"
								onClick={() => {
									apply()
									setConfirmOpen(false)
								}}
							>
								{t('applyNewFilter')}
							</button>
						</div>
					</section>
				</div>
			)}
		</>
	)
}
