import { chechEAUpdates, chechMainlineUpdates } from './checkYuzuUpdates.js'

export const initializeJobs = () => {
	chechMainlineUpdates.start()
	chechEAUpdates.start()
}
