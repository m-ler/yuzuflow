import express from 'express'
import cors from 'cors'
import versionsRouter from './routes/versions.js'
import { initializeJobs } from './jobs/index.js'
import apicache from 'apicache'

apicache.options({ debug: process.env.NODE_ENV === 'development' })

const app = express()
app.use(cors())
app.use('/versions', versionsRouter)

app.listen(3000, () => console.log('API running on port 3000:', process.env.NODE_ENV))
initializeJobs()
