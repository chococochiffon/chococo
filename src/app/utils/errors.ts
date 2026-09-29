/**
 * エラーの本文から、biscuit の応答({ message, errors })を取り出す。
 * chococo のサーバーが createError で中継したエラー(ログイン・パスワード再設定)は、biscuit の応答が data の下に入る。
 */
function biscuitErrorBody(error: unknown): { message?: string, errors?: Record<string, string[]> } | undefined {
  const data = (error as { data?: { data?: unknown } })?.data

  return (data?.data && typeof data.data === 'object' ? data.data : data) as { message?: string, errors?: Record<string, string[]> } | undefined
}

/**
 * biscuit の入力エラー(422。{ errors: { 項目名: [メッセージ] } })を、項目名 → 最初のメッセージにする。入力エラーでなければ空。
 */
export function validationErrors(error: unknown): Record<string, string> {
  const errors = biscuitErrorBody(error)?.errors ?? {}

  return Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, messages[0] ?? '']))
}

/**
 * エラーの全体のメッセージ(入力エラーの先頭のメッセージ、なければ既定の文言)。
 */
export function errorMessage(error: unknown, fallback = '処理に失敗しました。時間をおいてもう一度お試しください。'): string {
  return Object.values(validationErrors(error))[0] ?? biscuitErrorBody(error)?.message ?? fallback
}
