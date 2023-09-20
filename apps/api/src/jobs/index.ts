import { chechEAUpdates, chechMainlineUpdates } from './checkYuzuUpdates.js'

export const initializeJobs = () => {
	chechEAUpdates.start()
	//chechMainlineUpdates.start()
}
