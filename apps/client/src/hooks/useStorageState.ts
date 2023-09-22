import { useEffect, useState } from 'react'
export default <T>(key: string, defaultValue: T) => {
	const stored = localStorage.getItem(key)
	const [state, setState] = useState(stored !== null ? JSON.parse(stored) : defaultValue)

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(state))
	}, [state])

	return [state, setState]
}
