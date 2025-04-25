import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function listPrinters(): Promise<string[]> {
  const { stdout } = await execAsync('wmic printer get name')
  return stdout
    .split('\n')
    .slice(1)
    .map(line => line.trim())
    .filter(name => name.length > 0)
}
