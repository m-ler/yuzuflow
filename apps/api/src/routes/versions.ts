import { GITHUB_PAGINATION_LIMIT, YUZU_EA_REPO_URL, YUZU_MAINLINE_REPO_URL } from './../config/constants.js'
import { octokit } from './../config/octokit.js'
import { VersionsRequest, YuzuType, YuzuVersion } from '@shared'
import express, { Request, Response } from 'express'
import apicache from 'apicache'
import { RepositoryRelease } from 'src/types.js'

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

const formatReleaseListToYuzuVersionList = (data: RepositoryRelease[]): YuzuVersion[] =>
	data.map((x) => ({
		name: x.tag_name,
		date: x.created_at,
		assetUrl: x.assets[0].browser_download_url,
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
			data: formatReleaseListToYuzuVersionList(releases.data),
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
