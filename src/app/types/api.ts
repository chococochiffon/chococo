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

export interface UserSkill {
  id: number
  name: string
  // 習熟度(0〜100)
  level: number
}

export interface UserDetail {
  id: number
  first_name: string | null
  family_name: string | null
  nick_name: string | null
  user_image_url: string | null
  comment: string | null
  name_settings: NameSetting
  // スキルリストの呼び出しでのみ含まれる
  skills?: UserSkill[]
}

// SNS リンクのサービス種別(アイコンの出し分けに使う)
export type SocialService =
  | 'x' | 'youtube' | 'github' | 'instagram' | 'facebook' | 'tiktok'
  | 'twitch' | 'discord' | 'threads' | 'amazon' | 'other'

export interface SocialLink {
  id: number
  service: SocialService
  name: string
  url: string
}

export interface SiteSetting {
  site_title: string | null
  description: string | null
  site_icon_url: string | null
  site_image_url: string | null
  social_links: SocialLink[]
}

export type CallType = 'short_sentence' | 'original_text' | 'link_list' | 'link' | 'archive' | 'skill_list'

// 呼び出しコンテンツ。実データは table_name をキーに入り、単一表示はオブジェクト・一覧表示は配列になる
export interface CallContent {
  call_type: CallType
  // 管理用のラベル(画面には表示しない)
  call_name: string
  // 公開側で表示する見出し・小見出し(未設定は null。見出しが空の枠は見出しなしで表示する)
  title: string | null
  subtitle: string | null
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

// Q&A の回答。question があれば、この回答を選ぶと次の質問へ進み、null なら answer_text を表示して終わる
export interface QaAnswer {
  id: number
  answer_text: string | null
  question: QaQuestion | null
}

export interface QaQuestion {
  id: number
  question_text: string
  answers: QaAnswer[]
}

// GET /api/question-answers の要素。簡易版(top_view が true)は short_* を持ち、分岐ありは question に最初の質問を持つ
export interface QuestionAnswer {
  id: number
  top_view: boolean
  short_question_text: string | null
  short_answer_text: string | null
  question: QaQuestion | null
}

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

// ページネーション付きの一覧(GET /api/articles など、Laravel の API Resource の形)
export interface Paginated<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
