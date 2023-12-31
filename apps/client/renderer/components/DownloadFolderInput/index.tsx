import { Input } from '@nextui-org/react'
import { FolderOpen } from 'lucide-react'
import { YuzuType } from 'shared'
import { useState } from 'react'

type Props = {
	type: YuzuType
	onChange?: (directory: string) => void
}

const DownloadFolderInput = ({ type, onChange }: Props) => {
	const [directory, setDirectory] = useState<string>(window.store.get(`${type}-download-directory`) || '')

	const onClick = async () => {
		const response = await window.fileExplorer.selectDirectory()
		const newValue = response?.[0]
		if (newValue) {
			setDirectory(newValue)
			window.store.set(`${type}-download-directory`, newValue)
			onChange?.(newValue)
			window.yuzu.detectInstalledVersions()
		}
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
