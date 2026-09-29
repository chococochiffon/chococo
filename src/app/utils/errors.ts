/**
 * biscuit の入力エラー(422。{ errors: { 項目名: [メッセージ] } })を、項目名 → 最初のメッセージにする。入力エラーでなければ空。
 */
export function validationErrors(error: unknown): Record<string, string> {
  const errors = (error as { data?: { errors?: Record<string, string[]> } })?.data?.errors ?? {}

  return Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, messages[0] ?? '']))
}

/**
 * エラーの全体のメッセージ(入力エラーの先頭のメッセージ、なければ既定の文言)。
 */
export function errorMessage(error: unknown, fallback = '処理に失敗しました。時間をおいてもう一度お試しください。'): string {
  const data = (error as { data?: { message?: string } })?.data

  return Object.values(validationErrors(error))[0] ?? data?.message ?? fallback
}
