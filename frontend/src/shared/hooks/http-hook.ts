import { useState, useCallback, useRef, useEffect } from 'react'

type AbortController = any

export default function useHttpClient() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const activeHttpRequests = useRef<AbortController>([])

	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach((abortCtrl: any) =>
				abortCtrl.abort()
			)
		}
	}, [])

	const sendRequest = useCallback(
		async (url: string, method = 'GET', body = null, headers = {}) => {
			setIsLoading(true)
			const httpAbortCrl = new AbortController()
			activeHttpRequests.current.push(httpAbortCrl)
			try {
				const response = await fetch(url, {
					method,
					body,
					headers,
                    signal: httpAbortCrl.signal
				})

				const responseData = await response.json()

				activeHttpRequests.current = activeHttpRequests.current.filter(
					(req: any) => req !== httpAbortCrl
				)

				if (!response.ok) {
					throw new Error(responseData.message)
				}

				setIsLoading(false)
				return responseData
			} catch (error) {
				console.log(error)
				setError(error.message)
				setIsLoading(false)
				throw error
			}
		},
		[]
	)

	const clearError = () => {
		setError(null)
	}

	return { isLoading, error, sendRequest, clearError }
}
