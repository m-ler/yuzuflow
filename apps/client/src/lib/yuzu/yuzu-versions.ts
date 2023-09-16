import axios, { AxiosResponseHeaders } from 'axios';
import { GITHUB_PAGINATION_RESULTS_LIMIT, YUZU_EA_VERSIONS_URL, YUZU_MAINLINE_VERSIONS_URL } from './config';
import { YuzuVersionsRequest } from '@/types';
import { clampNumber } from '../utils/math';

const getPageCountFromHeaders = (headers: AxiosResponseHeaders, pageSize: number) => {
	const linkHeader = (headers.get('link') as string) ?? '';
	const regex = /page=(\d+)>; rel="last"/;
	const match = linkHeader.match(regex);
	const pageLimit = Math.ceil(GITHUB_PAGINATION_RESULTS_LIMIT / pageSize);
	if (match) return clampNumber(parseInt(match[1]), 0, pageLimit);
	return 0;
};

export const getMainlineVersions = async (page: number, pageSize: number): Promise<YuzuVersionsRequest> => {
	const response = await axios.get(`${YUZU_MAINLINE_VERSIONS_URL}?per_page=${pageSize}&page=${page}`);
	return {
		versions: response.data,
		pageCount: getPageCountFromHeaders(response.headers as AxiosResponseHeaders, pageSize),
	};
};

export const getEAVersions = async (page: number, pageSize: number): Promise<YuzuVersionsRequest> => {
	return axios.get(`${YUZU_EA_VERSIONS_URL}?per_page=${pageSize}&page=${page}`);
};
