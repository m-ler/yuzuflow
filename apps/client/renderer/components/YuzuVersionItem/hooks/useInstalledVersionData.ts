import { installedVersionsState } from '@/renderer/store/installed-versions'
import { useMemo } from 'react'
import { YuzuVersion } from 'shared'

export default (data: YuzuVersion) => {
	const installedVersions = installedVersionsState()[data.type]

	const versionData = useMemo(
		() => installedVersions.find((x) => x.versionTag === data.versionTag),
		[installedVersions]
	)

	return versionData
}
