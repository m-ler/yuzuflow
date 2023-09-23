import { Input } from '@nextui-org/react'
import { FolderOpen } from 'lucide-react'
import { YuzuType } from '@shared'
import useStorageState from '@/hooks/useStorageState'

type Props = {
	type: YuzuType
}

const DownloadFolderInput = ({ type }: Props) => {
	const [directory, setDirectory] = useStorageState(`${type}-download-directory`, '')
	const onClick = async () => {
		const response = await window.fileExplorer.selectDirectory()
		if (response?.[0]) setDirectory(response[0])
	}

	return (
		<div className="[&_*]:!cursor-pointer" onClick={onClick}>
			<Input
				label={`${type === 'ea' ? 'Early Access' : 'Mainline'} download folder`}
				readOnly
				placeholder="..."
				value={directory}
				classNames={{
					base: 'max-w-lg',
					input: 'text-zinc-300',
				}}
				startContent={<FolderOpen className="text-zinc-500" size={16} />}
				endContent={
					<div className="flex items-center [&>span]:text-xl">
						<span className="text-cyan-600">•</span>
						<span className={type === 'ea' ? 'text-amber-500' : 'text-rose-500'}>•</span>
					</div>
				}
			/>
		</div>
	)
}

export default DownloadFolderInput
