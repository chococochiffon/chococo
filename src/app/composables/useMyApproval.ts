import type { Ref } from 'vue'
import type { ArticleApproval } from '~/types/api'

// マイページの、承認の流れがあるもの(記事・ギャラリーの画像)の一覧・作成・編集で共通の処理

/**
 * 作成・削除のあとに一覧へ渡すメッセージ(key ごとの useState)。一覧は take() で取り出して消す。
 */
export function useMypageFlash(key: string) {
  const flash = useState<string>(key, () => '')

  function take(): string {
    const message = flash.value
    flash.value = ''

    return message
  }

  return { flash, take }
}

/**
 * 一覧の公開ステータスの絞り込み(GET パラメータ approval。不正な値は「すべて」)。
 */
export function useApprovalFilter() {
  const route = useRoute()

  const filters: { value: ArticleApproval | undefined, label: string }[] = [
    { value: undefined, label: 'すべて' },
    { value: 'draft', label: '下書き' },
    { value: 'pending', label: '承認待ち' },
    { value: 'published', label: '公開中' },
  ]

  const approval = computed(() => filters.find(filter => filter.value === route.query.approval)?.value)

  return { filters, approval }
}

/**
 * 編集画面の操作(保存後の作り直し・承認の申請の取り下げ・削除)。
 * - endpoint: biscuit の API の中継先(例: /api/me/articles)。取り下げは {endpoint}/{id}/withdraw、削除は {endpoint}/{id}
 * - listPath: 削除したあとに戻る一覧のパス。flashKey はその一覧に渡すメッセージの key
 * - noun: 確認・完了の文言に使う名前(記事・画像)。name はその 1 件の名前(タイトルなど)
 */
export function useMyApprovalActions<T extends { id: number, approval: ArticleApproval }>(item: Ref<T | null | undefined>, options: {
  endpoint: string
  listPath: string
  flashKey: string
  noun: string
  name: (item: T) => string
}) {
  const { flash } = useMypageFlash(options.flashKey)
  const status = ref('')
  const { errors, submitting, submit } = useFormSubmit({ fieldErrors: false })
  // 保存のたびにフォームを保存後の値で作り直す(ボタン・画像などを最新にする)
  const formKey = ref(0)

  function onSaved(saved: T, message: string) {
    item.value = saved
    formKey.value++
    status.value = message
    errors.value = {}
  }

  async function withdraw() {
    if (!window.confirm('承認の申請を取り下げて、下書きに戻しますか?')) {
      return
    }

    await submit(async () => {
      onSaved((await $fetch<{ data: T }>(`${options.endpoint}/${item.value!.id}/withdraw`, { method: 'POST' })).data, '承認の申請を取り下げました。')
    })
  }

  async function destroy() {
    const warning = item.value!.approval === 'published' ? `公開中の${options.noun}です。削除すると公開側にも表示されなくなります。` : ''

    if (!window.confirm(`${warning}「${options.name(item.value!)}」を削除しますか?`)) {
      return
    }

    await submit(async () => {
      await $fetch(`${options.endpoint}/${item.value!.id}`, { method: 'DELETE' })
      flash.value = `${options.noun}を削除しました。`
      await navigateTo(options.listPath)
    })
  }

  return { status, errors, working: submitting, formKey, onSaved, withdraw, destroy }
}
