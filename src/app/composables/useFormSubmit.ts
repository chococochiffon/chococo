/**
 * フォームの送信の共通処理: 送信中の状態(submitting)と、biscuit から返ったエラー(errors)を持つ。
 * errors は項目名 → メッセージで、項目の下に出す。項目に出せないエラーは '_' に入れ、フォームの上にまとめて出す。
 * - fieldErrors: false なら、入力エラーも項目に分けず '_' だけに入れる(ログイン・記事の取り下げなど、項目の欄がない操作)
 * - generalErrorFields: 項目の欄がない項目の入力エラー(記事の approval・再設定のリンクの token など)。あれば '_' に出す
 * - tooManyRequestsMessage: 回数制限(429)のときに '_' に出す文言
 * - fallbackMessage: 入力エラー以外で、biscuit のメッセージもないときの文言
 */
export function useFormSubmit(options: {
  fieldErrors?: boolean
  generalErrorFields?: string[]
  tooManyRequestsMessage?: string
  fallbackMessage?: string
} = {}) {
  const errors = ref<Record<string, string>>({})
  const submitting = ref(false)

  function toErrors(error: unknown): Record<string, string> {
    if ((error as { statusCode?: number }).statusCode === 429 && options.tooManyRequestsMessage) {
      return { _: options.tooManyRequestsMessage }
    }

    const general = errorMessage(error, options.fallbackMessage)

    if (options.fieldErrors === false) {
      return { _: general }
    }

    const fields = validationErrors(error)
    const generalFieldError = options.generalErrorFields?.map(field => fields[field]).find(Boolean)

    return generalFieldError || Object.keys(fields).length === 0
      ? { ...fields, _: generalFieldError ?? general }
      : fields
  }

  /**
   * エラーを消してから action を実行し、失敗したら errors に入れる。成功したら true を返す。
   */
  async function submit(action: () => Promise<void>): Promise<boolean> {
    submitting.value = true
    errors.value = {}

    try {
      await action()

      return true
    }
    catch (e) {
      errors.value = toErrors(e)

      return false
    }
    finally {
      submitting.value = false
    }
  }

  return { errors, submitting, submit }
}
