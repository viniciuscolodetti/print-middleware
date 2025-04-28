import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

interface PrinterInfo {
  name: string
  deviceId: string
  workOffline: boolean
  printerStatus: string
  extendedPrinterStatus: string
  status: string
  jobs?: number
}

export async function listPrinters(): Promise<PrinterInfo[]> {
  const { stdout } = await execAsync('wmic printer get DeviceID,Name,WorkOffline,PrinterStatus,ExtendedPrinterStatus,Status')

  const lines = stdout.trim().split('\n').map(line => line.trim()).filter(Boolean)
  
  const headers = lines[0].split(/\s{2,}/)
  const printersRaw = lines.slice(1)

  const printers: PrinterInfo[] = printersRaw.map(line => {
    const parts = line.split(/\s{2,}/)
    const data = Object.fromEntries(headers.map((header, index) => [header, parts[index] ?? '']))

    return {
      name: data['Name'] || '',
      deviceId: data['DeviceID'] || '',
      workOffline: (data['WorkOffline'] || '').toLowerCase() === 'true',
      printerStatus: mapPrinterStatus(data['PrinterStatus']),
      extendedPrinterStatus: mapExtendedPrinterStatus(data['ExtendedPrinterStatus']),
      status: data['Status'] || '',
    }
  }).filter(p => p.name.length > 0)

  for (const printer of printers) {
    printer.jobs = await getPrinterJobs(printer.deviceId)
  }

  return printers
}

async function getPrinterJobs(deviceId: string): Promise<number> {
  try {
    const { stdout } = await execAsync(`wmic printjob get JobId,Name`)
    const lines = stdout.trim().split('\n').slice(1)
    return lines.filter(line => line.includes(deviceId)).length
  } catch (err) {
    return 0
  }
}

function mapPrinterStatus(code: string = ''): string {
  switch (parseInt(code)) {
    case 3: return 'Idle'
    case 4: return 'Printing'
    case 5: return 'Warmup'
    default: return 'Unknown'
  }
}

function mapExtendedPrinterStatus(code: string = ''): string {
  switch (parseInt(code)) {
    case 3: return 'Idle'
    case 4: return 'Printing'
    case 5: return 'Warmup'
    case 7: return 'Offline'
    case 8: return 'Paused'
    case 9: return 'Error'
    case 10: return 'Busy'
    default: return 'Unknown'
  }
}
