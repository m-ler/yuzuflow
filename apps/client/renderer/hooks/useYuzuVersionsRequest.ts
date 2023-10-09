import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { VersionsRequest, YuzuType } from 'shared'
import { API_BASE_URL, TABLE_PAGINATION_SIZE } from '@/renderer/config/constants'

type Params = {
	type: YuzuType
	page: number
}

const getMainlineVersions = async (page: number, pageSize: number): Promise<VersionsRequest> => {
	const response = await window.yuzu.getYuzuReleases(API_BASE_URL, 'mainline', pageSize, page)
	return response.data
}

const getEAVersions = async (page: number, pageSize: number): Promise<VersionsRequest> => {
	const response = await window.yuzu.getYuzuReleases(API_BASE_URL, 'ea', pageSize, page)
	return response.data
}

export default ({ type, page }: Params) => {
	const request = useMemo(() => (type === 'ea' ? getEAVersions : getMainlineVersions), [type])

	const query = useQuery({
		queryKey: [type, page],
		queryFn: () => request(page, TABLE_PAGINATION_SIZE),
		staleTime: 1000 * 30,
		keepPreviousData: true,
		retry: false,
		refetchOnWindowFocus: false,
	})

	return query
}
