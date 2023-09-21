import { getEAVersions, getMainlineVersions } from '@/lib/yuzu/yuzu-versions-request'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

type Params = {
	type: 'mainline' | 'ea'
	page: number
}

export default ({ type, page }: Params) => {
	const request = useMemo(() => (type === 'ea' ? getEAVersions : getMainlineVersions), [])

	const query = useQuery({
		queryKey: [type, page],
		queryFn: () => request(page, 10),
		staleTime: Infinity,
		keepPreviousData: true,
		retry: false,
	})

	return query
}
