// biscuit の公開 API(/api/*)のレスポンス型

export interface Tag {
  id: number
  name: string
}

export interface Article {
  id: number
  title: string
  parent_path: string | null
  slug: string | null
  path: string
  content: string | null
  thumbnail_url: string | null
  author_name: string | null
  // タグを読み込んでいない場合は含まれない
  tags?: Tag[]
  published_at: string | null
  updated_at: string | null
}

export interface SinglePageDetail {
  id: number
  sub_title: string | null
  contents: string | null
  sort_order: number
}

export interface SinglePage {
  id: number
  title: string
  short_sentences: string | null
  header_image_url: string | null
  parent_path: string | null
  slug: string
  path: string
  // 詳細を読み込んでいない場合(呼び出しコンテンツの一覧など)は含まれない
  details?: SinglePageDetail[]
}

// 名前の表示設定(1: 非表示 / 2: フルネーム / 3: ニックネーム / 4: 名前のみ)
export type NameSetting = 1 | 2 | 3 | 4

export interface UserDetail {
  id: number
  first_name: string | null
  family_name: string | null
  nick_name: string | null
  user_image_url: string | null
  comment: string | null
  name_settings: NameSetting
}

export interface SiteSetting {
  site_title: string | null
  description: string | null
  site_icon_url: string | null
  site_image_url: string | null
}

export type CallType = 'short_sentence' | 'original_text' | 'link_list' | 'link' | 'archive' | 'skill_list'

// 呼び出しコンテンツ。実データは table_name をキーに入り、単一表示はオブジェクト・一覧表示は配列になる
export interface CallContent {
  call_type: CallType
  call_name: string
  articles?: Article | Article[] | null
  single_pages?: SinglePage | SinglePage[] | null
  user_details?: UserDetail | UserDetail[] | null
}

// 呼び出しコンテンツの実データを種別ごとに配列へそろえたもの
export type CallContentItems =
  | { kind: 'articles', items: Article[] }
  | { kind: 'single_pages', items: SinglePage[] }
  | { kind: 'user_details', items: UserDetail[] }
  | { kind: null, items: [] }

// GET /api/resolve のレスポンス
export type ResolveResponse =
  | { type: 'top', data: null, call_contents: CallContent[] }
  | { type: 'article', data: Article, call_contents: CallContent[] }
  | { type: 'single_page', data: SinglePage, call_contents: CallContent[] }

// リンク系(リンク・リンクリスト)の表示用に、記事・固定ページ・ユーザー詳細をそろえた項目
export interface LinkItem {
  key: string
  title: string
  text: string | null
  imageUrl: string | null
  // ユーザー詳細など、リンク先のページを持たない場合は null
  path: string | null
  date: string | null
}
