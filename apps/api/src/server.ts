import express from 'express'
import cors from 'cors'
import versionsRouter from './routes/versions.js'
import { initializeJobs } from './jobs/index.js'
import apicache from 'apicache'

apicache.options({ debug: true })

const app = express()
app.use(cors())
app.use('/versions', versionsRouter)

app.listen(3000)
initializeJobs()
