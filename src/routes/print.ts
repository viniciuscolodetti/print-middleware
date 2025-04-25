import { Router, Request, Response } from 'express'
import { printPdf } from '../services/print-service'

export const printRoutes = Router()

printRoutes.post('/print', async (req: Request, res: Response) => {
  try {
    const { base64, printerName, userName, reportName } = req.body as {
      base64?: string
      printerName?: string
      userName?: string
      reportName?: string
    }

    if (!base64 || !userName || !reportName) {
      res.status(400).json({ error: 'Missing required fields.' })
      return
    }

    await printPdf(base64, { printerName, userName, reportName })

    res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error('Print error:', error)
    res.status(500).json({ error: 'Failed to print document.' })
  }
})
