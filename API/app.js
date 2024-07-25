import express, { json } from 'express'
import router from './routes/routes.movies.js'
import { corsMiddleware } from './middleware/cors.js'

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

//root
app.get('/', (req, res) => res.json({message: 'Hello World!'}))

app.use('/movies', router)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => console.log(`Example app listening on port http://localhost:${PORT}`))