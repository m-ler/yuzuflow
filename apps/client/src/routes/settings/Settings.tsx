import DownloadFolderInput from '@/components/DownloadFolderInput/DownloadFolderInput'
import PageTransition from '@/components/Transitions/PageTransition'

const Settings = () => {
	return (
		<PageTransition>
			<section className="w-full h-full max-h-full p-4 overflow-auto">
				<div className="flex flex-col gap-4 mx-auto w-full h-full max-w-screen-lg">
					<DownloadFolderInput type="mainline" />
					<DownloadFolderInput type="ea" />
				</div>
			</section>
		</PageTransition>
	)
}

export default Settings
