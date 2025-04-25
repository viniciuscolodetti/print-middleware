import { Router } from 'express'
import { listPrinters } from '../services/printer-service'

export const printersRoutes = Router()

printersRoutes.get('/printers', async (_req, res) => {
  try {
    const printers = await listPrinters()
    res.status(200).json({ printers })
  } catch (error) {
    res.status(500).json({ error: 'Failed to list printers.' })
  }
})
