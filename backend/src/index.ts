import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import authRoutes from './routes/auth'

const app = express()
const PORT = 3000

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
