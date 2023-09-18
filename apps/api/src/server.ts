import express from 'express'
import cors from 'cors'
import versionsRouter from './routes/versions.js'

const app = express()
app.use(cors())

app.use('/versions', versionsRouter)

app.listen(3000)
