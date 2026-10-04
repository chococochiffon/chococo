import type { NameSetting, UserDetail } from '~/types/api'

// ユーザー詳細の「公開する名前」(name_settings)の選択肢。マイページのプロフィールと招待の受諾で共通に使う
export const nameSettingOptions: { value: NameSetting, label: string }[] = [
  { value: 1, label: '非表示' },
  { value: 2, label: 'フルネーム' },
  { value: 3, label: 'ニックネーム' },
  { value: 4, label: '名前のみ' },
]

/**
 * ユーザー詳細の名前の表示設定に従って表示名を返す(非表示の場合は null)。
 */
export function userDisplayName(userDetail: Pick<UserDetail, 'name_settings' | 'family_name' | 'first_name' | 'nick_name'>): string | null {
  switch (userDetail.name_settings) {
    case 2:
      return [userDetail.family_name, userDetail.first_name].filter(Boolean).join(' ') || null
    case 3:
      return userDetail.nick_name
    case 4:
      return userDetail.first_name
    default:
      return null
  }
}
