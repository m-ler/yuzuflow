import { Button } from '@nextui-org/react'
import { Trash2 } from 'lucide-react'
import { YuzuVersion } from 'shared'
import useInstalledVersionData from './hooks/useInstalledVersionData'
import { toast } from 'react-hot-toast'

type Props = {
	data: YuzuVersion
}

const RemoveVersionButton = ({ data }: Props) => {
	const versionData = useInstalledVersionData(data)

	const onClick = () => {
		const deleteError = window.fileExplorer.deleteDirectory(versionData?.directory || '')
		if (deleteError) toast.error('Could not delete this Yuzu version. Please make sure Yuzu is not running.')
		else window.yuzu.detectInstalledVersions()
	}

	return (
		<Button isIconOnly size="sm" className="bg-zinc-950/50 hover:bg-black" onClick={onClick}>
			<Trash2 size={14} className="text-zinc-300" />
		</Button>
	)
}

export default RemoveVersionButton
