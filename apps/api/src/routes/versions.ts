import { VersionsRequest } from '@shared'
import express, { Request, Response } from 'express'
const versionsRouter = express.Router()

versionsRouter.get('/mainline', (req: Request, res: Response) => {
	const result: VersionsRequest = {
		data: [],
		page: 1,
		pageCount: 100,
		pageSize: 10,
	}
	res.send(JSON.stringify(result))
})

versionsRouter.get('/ea', (req: Request, res: Response) => {
	const result: VersionsRequest = {
		data: [],
		page: 1,
		pageCount: 100,
		pageSize: 10,
	}
	res.send(JSON.stringify(result))
})

export default versionsRouter
