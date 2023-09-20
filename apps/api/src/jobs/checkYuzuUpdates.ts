import { YUZU_EA_REPO_URL, YUZU_MAINLINE_REPO_URL } from './../config/constants.js'
import { octokit } from './../config/octokit.js'
import cron from 'node-cron'
import apicache from 'apicache'

const checkingUpdate = {
	mainline: false,
	ea: false,
}

const latestVersionsIds: Record<'mainline' | 'ea', number | undefined> = {
	mainline: undefined,
	ea: undefined,
}

const checkReleaseUpdates = (type: 'mainline' | 'ea') => {
	if (checkingUpdate[type]) return
	checkingUpdate[type] = true

	octokit
		.request(`GET /${type === 'ea' ? YUZU_EA_REPO_URL : YUZU_MAINLINE_REPO_URL}?per_page=1&page=1`)
		.then((res) => {
			const { id } = res.data?.[0] as { id: number | undefined }
			console.log('REQUEST: ', type, id)
			if (!id) return
			const newRelesase = id !== latestVersionsIds[type]
			if (newRelesase) apicache.clear(`/versions/${type}`)
		})
		.catch((e) => {
			console.error(e)
		})
		.finally(() => {
			checkingUpdate[type] = false
		})
}

export const chechMainlineUpdates = cron.schedule('*/3 * * * * *', () => checkReleaseUpdates('mainline'), {
	scheduled: false,
})

export const chechEAUpdates = cron.schedule('*/3 * * * * *', () => checkReleaseUpdates('ea'), {
	scheduled: false,
})
