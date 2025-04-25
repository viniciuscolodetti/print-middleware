import { Router } from 'express'

export const indexRoutes = Router()

indexRoutes.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Print Middleware is running.' })
})
