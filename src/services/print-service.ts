import { spawn, exec } from 'node:child_process'
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
  const sumatraPath = path.join(process.cwd(), 'SumatraPDF.exe')

  if (!fs.existsSync(sumatraPath)) {
    throw new Error(`SumatraPDF.exe not found at ${sumatraPath}`)
  }

  const buffer = Buffer.from(base64, 'base64')
  fs.writeFileSync(pdfPath, buffer)

  const args = options.printerName
    ? ['-print-to', options.printerName, '-silent', pdfPath]
    : ['-print-to-default', '-silent', pdfPath]

  log(`User "${options.userName}" printed file "${fileName}" on printer "${options.printerName || 'default'}"`)

  return new Promise((resolve, reject) => {
    const proc = spawn(sumatraPath, args, {
      detached: true,
      stdio: 'ignore',
    })

    proc.on('error', err => {
      log('Error starting SumatraPDF: ' + err)
      reject(new Error('Failed to start SumatraPDF.'))
    })

    proc.unref()

    setTimeout(() => {
      exec('taskkill /IM SumatraPDF.exe /F', (error) => {
        if (error) {
          log('Failed to kill SumatraPDF.exe: ' + error.message)
        } else {
          log('SumatraPDF.exe killed after print.')
        }
      })
    }, 5000)

    resolve()
  })
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, '_')
}
