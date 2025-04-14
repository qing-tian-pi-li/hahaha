export function parseLRC(lrcText) {
    const lines = lrcText.split('\n')
    const timeMap = new Map()
    
    lines.forEach(line => {
      const timeRegex = /\[(\d{2}):(\d{2}\.\d{2})\]/
      const match = line.match(timeRegex)
      if (match) {
        const minutes = parseInt(match[1])
        const seconds = parseFloat(match[2])
        const timeInMs = (minutes * 60 + seconds) * 1000
        const text = line.replace(timeRegex, '').trim()
        timeMap.set(timeInMs, text)
      }
    })
    
    return timeMap
  }