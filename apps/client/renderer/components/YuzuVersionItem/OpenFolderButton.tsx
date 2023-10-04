import { installedVersionsState } from '@/renderer/store/installed-versions'
import { Button } from '@nextui-org/react'
import { FolderOpen } from 'lucide-react'
import { useMemo } from 'react'
import { YuzuType } from 'shared'

type Props = {
	type: YuzuType
	versionTag: string
}

const OpenFolderButton = ({ type, versionTag }: Props) => {
	const installedVersions = installedVersionsState()[type]
	const versionData = useMemo(() => installedVersions.find((x) => x.versionTag === versionTag), [installedVersions])

	const onClick = () => {
		if (versionData?.directory) window.fileExplorer.openDirectory(versionData.directory)
	}

	return (
		<Button isIconOnly size="sm" className="bg-zinc-950/50 hover:bg-black" onClick={onClick}>
			<FolderOpen size={14} className="text-zinc-300" />
		</Button>
	)
}

export default OpenFolderButton
