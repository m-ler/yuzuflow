import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { YuzuType } from 'shared'
import DownloadFolderInput from '../DownloadFolderInput/DownloadFolderInput'
import { useState } from 'react'

type Props = {
	open: boolean
	onClose: (directory: string) => void
	type: YuzuType
}

const DialogFolderInput = ({ open, onClose, type }: Props) => {
	const [value, setValue] = useState('')

	return (
		<Modal isOpen={open} onOpenChange={(isOpen) => !isOpen && onClose(value)} placement="center">
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-zinc-500">Select download folder</ModalHeader>
						<ModalBody className="pb-6">
							{<DownloadFolderInput type={type} onChange={(newValue) => setValue(newValue)} />}
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default DialogFolderInput
