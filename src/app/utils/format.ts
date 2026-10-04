// 日時・文章・ファイルの大きさの表示の整形(SSR とブラウザで結果がずれないよう、日時は日本時間に固定する)

/**
 * ISO 8601 の日時を「YYYY/MM/DD」(日本時間)に整形する。SSR とブラウザで結果がずれないようタイムゾーンを固定する。
 */
export function formatDate(iso: string | null): string {
  if (!iso) {
    return ''
  }

  return new Date(iso).toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * ISO 8601 の日時を「YYYY/MM/DD HH:mm」(日本時間)に整形する(マイページの一覧など、管理画面と同じ表記)。
 */
export function formatDateTime(iso: string | null): string {
  if (!iso) {
    return ''
  }

  return new Date(iso).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * HTML(本文リッチテキスト)からタグを除いて先頭 length 文字の抜粋を作る(description 用)。
 */
export function excerpt(html: string | null, length = 120): string {
  if (!html) {
    return ''
  }

  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

  return text.length > length ? `${text.slice(0, length)}…` : text
}

/**
 * バイト数を「1.5 MB」のように整形する(管理画面のダッシュボードと同じ表記)。
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unit = 0

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit++
  }

  return `${size.toLocaleString('ja-JP', { maximumFractionDigits: unit === 0 ? 0 : 1, minimumFractionDigits: unit === 0 ? 0 : 1 })} ${units[unit]}`
}
