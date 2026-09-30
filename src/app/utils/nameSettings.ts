import type { NameSetting } from '~/types/api'

// ユーザー詳細の「公開する名前」(name_settings)の選択肢。マイページのプロフィールと招待の受諾で共通に使う
export const nameSettingOptions: { value: NameSetting, label: string }[] = [
  { value: 1, label: '非表示' },
  { value: 2, label: 'フルネーム' },
  { value: 3, label: 'ニックネーム' },
  { value: 4, label: '名前のみ' },
]
