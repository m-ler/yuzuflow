export type YuzuVersion = {
	name: string
	date: string
	assetUrl: string | null
}

export type Paginated<TData> = {
	data: TData[]
	page: number
	pageCount: number
	pageSize: number
}

export type VersionsRequest = Paginated<YuzuVersion>

export type YuzuType = 'mainline' | 'ea'
