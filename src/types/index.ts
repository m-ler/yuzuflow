export type YuzuVersion = {
	name: string;
	date: string;
};

export type YuzuVersionsRequest = {
	versions: YuzuVersion[];
	pageCount: number;
};
