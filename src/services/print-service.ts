import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { log } from '../utils/logger'

interface PrintPdfOptions {
  printerName?: string
  userName: string
  reportName: string
}

export async function printPdf(base64: string, options: PrintPdfOptions): Promise<void> {
  const labelsPath = path.join(process.cwd(), 'labels')
  if (!fs.existsSync(labelsPath)) {
    fs.mkdirSync(labelsPath)
  }

  const now = new Date()
  const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').substring(0, 19)
  const fileName = `${timestamp}_${sanitizeFileName(options.reportName)}.pdf`
  const pdfPath = path.join(labelsPath, fileName)
  const pdfToPrinterPath = path.join(process.cwd(), 'PDFtoPrinter.exe')

  if (!fs.existsSync(pdfToPrinterPath)) {
    throw new Error(`PDFtoPrinter.exe not found at ${pdfToPrinterPath}`)
  }

  const buffer = Buffer.from(base64, 'base64')
  fs.writeFileSync(pdfPath, buffer)

  const args = options.printerName
    ? [pdfPath, options.printerName]
    : [pdfPath]

  log(`User "${options.userName}" printed file "${fileName}" on printer "${options.printerName || 'default'}" using PDFtoPrinter.`)

  return new Promise((resolve, reject) => {
    const proc = spawn(pdfToPrinterPath, args, {
      detached: true,
      stdio: 'ignore',
    })

    proc.on('error', err => {
      log('Error starting PDFtoPrinter: ' + err)
      reject(new Error('Failed to start PDFtoPrinter.'))
    })

    proc.unref()

    resolve()
  })
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, '_')
}