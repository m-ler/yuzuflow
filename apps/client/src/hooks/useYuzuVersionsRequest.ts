import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { VersionsRequest, YuzuType } from 'shared'
import { API_BASE_URL } from '@/config/constants'
import axios from 'axios'

type Params = {
	type: YuzuType
	page: number
}

const getMainlineVersions = async (page: number, pageSize: number): Promise<VersionsRequest> => {
	const response = await axios.get(`${API_BASE_URL}/versions/mainline?per_page=${pageSize}&page=${page}`)
	return response.data
}

const getEAVersions = async (page: number, pageSize: number): Promise<VersionsRequest> => {
	const response = await axios.get(`${API_BASE_URL}/versions/ea?per_page=${pageSize}&page=${page}`)
	return response.data
}

export default ({ type, page }: Params) => {
	const request = useMemo(() => (type === 'ea' ? getEAVersions : getMainlineVersions), [type])

	const query = useQuery({
		queryKey: [type, page],
		queryFn: () => request(page, 8),
		staleTime: 1000 * 30,
		keepPreviousData: true, 
		retry: false,
		refetchOnWindowFocus: false,
	})

	return query
}
