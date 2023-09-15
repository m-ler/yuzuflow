import axios, { AxiosResponseHeaders } from 'axios';
import { YUZU_EA_VERSIONS_URL, YUZU_MAINLINE_VERSIONS_URL } from './config';
import { YuzuVersionsRequest } from '@/types';

const getPageCountFromHeaders = (headers: AxiosResponseHeaders) => {
	const linkHeader = (headers.get('link') as string) ?? '';
	const regex = /page=(\d+)>; rel="last"/;
	const match = linkHeader.match(regex);
	if (match) return parseInt(match[1]);
	return 0;
};

export const getMainlineVersions = async (page: number, pageSize: number): Promise<YuzuVersionsRequest> => {
	const response = await axios.get(`${YUZU_MAINLINE_VERSIONS_URL}?per_page=${pageSize}&page=${page}`);
	return {
		versions: response.data,
		pageCount: getPageCountFromHeaders(response.headers as AxiosResponseHeaders),
	};
};

export const getEAVersions = async (page: number, pageSize: number): Promise<YuzuVersionsRequest> => {
	return axios.get(`${YUZU_EA_VERSIONS_URL}?per_page=${pageSize}&page=${page}`);
};
