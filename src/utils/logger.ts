export function log(message: string) {
  const now = new Date()
  
  const timestamp = now.toLocaleString('sv-SE', {
    timeZone: 'America/Sao_Paulo',
    hour12: false,
  }).replace('T', ' ')

  console.log(`[${timestamp}] ${message}`)
}
