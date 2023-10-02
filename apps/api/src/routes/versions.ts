import { YUZU_EA_REPO_URL, YUZU_MAINLINE_REPO_URL, VersionsRequest, YuzuType, YuzuVersion } from '@shared/index.js'
import express, { Request, Response } from 'express'
import apicache from 'apicache'
import { ReleaseAsset, RepositoryRelease } from 'types.js'
import { GITHUB_PAGINATION_LIMIT } from '@/config/constants.js'
import { octokit } from '@/config/octokit.js'

const cache = apicache.middleware('6 hours', (req: Request, res: Response) => res.statusCode === 200)
const versionsRouter = express.Router()

const getPageCountFromLinkHeader = (header: string, pageSize: number) => {
	const limit = Math.ceil(GITHUB_PAGINATION_LIMIT / pageSize)
	const regex = /page=(\d+)>; rel="last"/
	const match = header.match(regex)
	if (match) {
		const pageCount = parseInt(match[1])
		return pageCount > limit ? limit : pageCount
	}
	return 0
}

const getReleaseAssetId = (type: YuzuType, assetList: ReleaseAsset[]) => {
	const getLink = (prefix: string, extensions: string[]) => {
		for (const ex of extensions) {
			for (const asset of assetList) {
				if (asset.name.includes(prefix) && asset.name.includes(ex)) return asset.id
			}
		}

		return null
	}

	const getMainlineAsset = () => getLink('yuzu-windows', ['.7z'])
	const getEarlyAcessAsset = () => getLink('Windows-Yuzu', ['.zip', '.7z'])

	return type === 'mainline' ? getMainlineAsset() : getEarlyAcessAsset()
}

const getReleaseName = (release: RepositoryRelease, type: YuzuType) => (type === 'ea' ? release.tag_name : release.name)

const formatReleaseListToYuzuVersionList = (data: RepositoryRelease[], type: YuzuType): YuzuVersion[] =>
	data.map((x) => ({
		name: getReleaseName(x, type),
		date: x.created_at,
		assetId: getReleaseAssetId(type, x.assets),
		type,
		versionTag: getReleaseName(x, type).replace(/\s/g, ''),
	}))

type QueryParams = {
	per_page: string
	page: string
}

const getReleases = async (req: Request, res: Response, type: YuzuType) => {
	const { per_page, page } = req.query as unknown as QueryParams

	try {
		const repoUrl = type == 'ea' ? YUZU_EA_REPO_URL : YUZU_MAINLINE_REPO_URL
		const releases = await octokit.request(`GET /${repoUrl}?per_page=${per_page}&page=${page}`)
		const pageCount = getPageCountFromLinkHeader(releases.headers.link || '', parseInt(per_page))
		const result: VersionsRequest = {
			data: formatReleaseListToYuzuVersionList(releases.data, type),
			page: parseInt(page),
			pageCount,
			pageSize: parseInt(per_page),
		}
		res.send(JSON.stringify(result))
	} catch {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

versionsRouter.get('/mainline', cache, async (req: Request, res: Response) => {
	getReleases(req, res, 'mainline')
})

versionsRouter.get('/ea', cache, async (req: Request, res: Response) => {
	getReleases(req, res, 'ea')
})

export default versionsRouter
