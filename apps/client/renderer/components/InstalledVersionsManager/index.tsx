import { InstalledVersions } from '@/main-process/types'
import { installedVersionTagsState } from '@/renderer/store/installed-version-tags'
import { installedVersionsState } from '@/renderer/store/installed-versions'
import { IpcRendererEvent } from 'electron'
import { useEffect } from 'react'

const InstalledVersionsManager = () => {
	const { updateInstalledVersions } = installedVersionsState()
	const { updateInstalledVersionTags } = installedVersionTagsState()

	const detectInstalledVersions = () => {
		window.yuzu.detectInstalledVersions()
	}

	useEffect(() => {
		detectInstalledVersions()
		const onVersionsUpdated = (_: IpcRendererEvent, versions: InstalledVersions) => {
			updateInstalledVersions(versions.mainline, versions.ea)

			const mainlineTags = versions.mainline.map((x) => x.versionTag)
			const eaTags = versions.ea.map((x) => x.versionTag)
			updateInstalledVersionTags(mainlineTags, eaTags)
		}

		window.yuzu.onInstalledVersionsUpdate(onVersionsUpdated)

		return () => {
			window.yuzu.removeOnInstalledVersionsUpdate()
		}
	}, [])

	return <></>
}

export default InstalledVersionsManager
