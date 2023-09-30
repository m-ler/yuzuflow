import YuzuVersionSkeleton from './YuzuVersionSkeleton'

type Props = {
	length: number
}

const SkeletonList = ({ length }: Props) => {
	return (
		<>
			{[...Array(length).fill(null)].map((_, i) => (
				<YuzuVersionSkeleton key={i} />
			))}
		</>
	)
}

export default SkeletonList
