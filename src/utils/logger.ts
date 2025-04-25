export function log(message: string) {
  const now = new Date()
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19)
  console.log(`[${timestamp}] ${message}`)
}