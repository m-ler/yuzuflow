export type ReleaseAsset = {
	url: string
	id: number
	node_id: string
	name: string
	label: string
	content_type: string
	state: string
	size: number
	download_count: number
	created_at: string
	updated_at: string
	browser_download_url: string
}

export type RepositoryRelease = {
	url: string
	assets_url: string
	upload_url: string
	html_url: string
	id: 120304356
	node_id: string
	tag_name: string
	target_commitish: string
	name: string
	draft: boolean
	prerelease: boolean
	created_at: string
	published_at: string
	assets: ReleaseAsset[]
}
