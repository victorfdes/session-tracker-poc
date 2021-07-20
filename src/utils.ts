export function makeid(length: number): string {
  let result: string = ''
  const characters: string = 'abcdefghijklmnopqrstuvwxyz0123456789!@'
  const charactersLength: number = characters.length
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
 }
 return result
}

export function formatDate (date: Date): string {
  const yyyy: string = (date.getFullYear() + '').padStart(4, '0')
  const mm: string = ((date.getMonth() + 1) + '').padStart(2, '0')
  const dd: string = (date.getDate() + '').padStart(2, '0')
  const hh: string = (date.getHours() + '').padStart(2, '0')
  const m: string = (date.getMinutes() + '').padStart(2, '0')
  const s: string = (date.getSeconds() + '').padStart(2, '0')
  const ms: string = (date.getMilliseconds() + '').padStart(3, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${m}:${s}:${ms}`
}
