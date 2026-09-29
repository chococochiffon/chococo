// パスワード再設定のメールの送信を biscuit へ依頼する(ログイン前。登録がないメールアドレスでも同じ応答)
export default defineEventHandler(event => postToBiscuitAsGuest<{ message: string }>(event, '/auth/forgot-password', ['email']))
