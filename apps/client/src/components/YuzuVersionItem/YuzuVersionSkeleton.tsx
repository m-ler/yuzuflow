import { Skeleton } from '@nextui-org/react'

const YuzuVersionSkeleton = () => {
	return (
		<Skeleton className="w-full rounded-md opacity-40">
			<div className="h-[60px] w-3/5 rounded-lg bg-default-200"></div>
		</Skeleton>
	)
}

export default YuzuVersionSkeleton
