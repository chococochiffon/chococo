// メールのリンクのトークンでパスワードを再設定する(ログイン前。biscuit が発行済みのログインをすべて無効にする)
export default defineEventHandler(event => postToBiscuitAsGuest(event, '/auth/reset-password', ['token', 'email', 'password', 'password_confirmation']))
