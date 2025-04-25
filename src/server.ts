import express from 'express'
import cors from 'cors'
import { indexRoutes } from './routes/index'
import { printRoutes } from './routes/print'
import { printersRoutes } from './routes/printers'
import fs from 'fs'
import path from 'path'

function loadPortConfig(): number {
  const configPath = path.join(process.cwd(), 'print-middleware.config')

  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf-8')
    const lines = content.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('PORT=')) {
        const portString = trimmed.split('=')[1]
        const port = parseInt(portString, 10)
        if (!isNaN(port) && port > 0 && port < 65536) {
          return port
        }
      }
    }
  }

  return 8787
}

const app = express()
const PORT = loadPortConfig()

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }))
app.use(express.json({ limit: '10mb' }))

app.use('/', indexRoutes)
app.use('/', printRoutes)
app.use('/', printersRoutes)

app.listen(PORT, () => {
  console.log(`🖨️  Print Middleware running at http://localhost:${PORT}`)
})
