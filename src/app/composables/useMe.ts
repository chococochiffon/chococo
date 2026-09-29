import type { Me } from '~/types/api'

/**
 * マイページのログイン状態(ログイン中のユーザー)と、ログイン・ログアウト・再取得。
 * API トークンは chococo のサーバーが HttpOnly の Cookie で持ち、ここからは chococo のサーバー API(/api/auth/*・/api/me)を呼ぶ。
 * SSR 時も useRequestFetch() でブラウザの Cookie を引き継いで呼ぶ。
 */
export function useMe() {
  const me = useState<Me | null>('me', () => null)
  // ログイン状態を一度でも確かめたか(ヘッダーなどで、ページを移動するたびに問い合わせないため)
  const checked = useState('me-checked', () => false)
  const requestFetch = useRequestFetch()

  // ログイン中のユーザーを取り直す(ログインしていない・トークンが切れていれば null)
  async function fetchMe(): Promise<Me | null> {
    me.value = await requestFetch<{ data: Me }>('/api/me')
      .then(response => response.data)
      .catch(() => null)
    checked.value = true

    return me.value
  }

  // まだ確かめていなければ、ログイン状態を確かめる
  async function ensureMe(): Promise<Me | null> {
    return checked.value ? me.value : await fetchMe()
  }

  async function login(email: string, password: string): Promise<void> {
    const response = await $fetch<{ data: Me }>('/api/auth/login', { method: 'POST', body: { email, password } })
    me.value = response.data
    checked.value = true
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' })
    me.value = null
  }

  return { me, fetchMe, ensureMe, login, logout }
}
