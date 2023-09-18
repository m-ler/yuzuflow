import axios from 'axios'
import { API_BASE_URL } from '@/config/constants'
import { VersionsRequest } from '@shared'

export const getMainlineVersions = async (page: number, pageSize: number): Promise<VersionsRequest> => {
	const response = await axios.get(`${API_BASE_URL}/versions/mainline?per_page=${pageSize}&page=${page}`)
	return response.data
}

export const getEAVersions = async (page: number, pageSize: number): Promise<VersionsRequest> => {
	return axios.get(`${API_BASE_URL}/versions/ea?per_page=${pageSize}&page=${page}`)
}
