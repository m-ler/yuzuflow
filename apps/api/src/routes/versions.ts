import { VersionsRequest } from '@shared'
import express, { Request, Response } from 'express'
import apicache from 'apicache'

const cache = apicache.middleware('6 hours', (req: Request, res: Response) => res.statusCode === 200)
const versionsRouter = express.Router()

versionsRouter.get('/mainline', cache, (req: Request, res: Response) => {
	const result: VersionsRequest = {
		data: [],
		page: 1,
		pageCount: 100,
		pageSize: 10,
	}
	res.send(JSON.stringify(result))
})

versionsRouter.get('/ea', cache, (req: Request, res: Response) => {
	const result: VersionsRequest = {
		data: [],
		page: 1,
		pageCount: 100,
		pageSize: 10,
	}
	res.send(JSON.stringify(result))
})

export default versionsRouter
