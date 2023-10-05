import { Button } from '@nextui-org/react'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { YuzuVersion } from 'shared'
import useInstalledVersionData from './hooks/useInstalledVersionData'

type Props = {
	data: YuzuVersion
}

const PlayButton = ({ data }: Props) => {
	const [loading, setLoading] = useState(false)
	const versionData = useInstalledVersionData(data)

	const onClick = () => {
		const yuzuExePath = `${versionData?.directory}/yuzu.exe`
		const pathExists = window.fileExplorer.fileExists(yuzuExePath)
		if (!pathExists) {
			toast.error('yuzu.exe not found.')
			return
		}
		window.fileExplorer.openFile(yuzuExePath)
		setLoading(true)
		setTimeout(() => {
			setLoading(false)
		}, 2000)
	}

	return (
		<Button isIconOnly size="sm" isLoading={loading} className="bg-zinc-950/50 hover:bg-black" onClick={onClick}>
			{!loading && <Play size={14} />}
		</Button>
	)
}

export default PlayButton
