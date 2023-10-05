import { Button } from '@nextui-org/react'
import { FolderOpen } from 'lucide-react'
import { YuzuVersion } from 'shared'
import useInstalledVersionData from './hooks/useInstalledVersionData'

type Props = {
	data: YuzuVersion
}

const OpenFolderButton = ({ data }: Props) => {
	const versionData = useInstalledVersionData(data)

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
