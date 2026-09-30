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
  // 投稿者(管理者の記事は id・profile_path が null。profile_path は投稿者ページを公開しているときだけ)。カスタムページは null
  author?: ArticleAuthor | null
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

// スキルの習熟度の上限(1〜この値の 5 段階)
export const MAX_SKILL_LEVEL = 5

export interface UserSkill {
  id: number
  name: string
  // 習熟度(1〜MAX_SKILL_LEVEL)
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

// トップのスライダー画像(16:9、1920x1080)。url はクリック時のリンク先(未設定は null)
export interface TopSliderImage {
  id: number
  image_url: string
  url: string | null
}

export interface SiteSetting {
  site_title: string | null
  description: string | null
  // 公開側フロントの URL・API の URL(未設定は null)
  front_url: string | null
  api_url: string | null
  site_icon_url: string | null
  // OGP 用の画像
  site_image_url: string | null
  social_links: SocialLink[]
  top_slider_images: TopSliderImage[]
}

export type CallType = 'short_sentence' | 'original_text' | 'link_list' | 'link' | 'archive' | 'skill_list' | 'tile_list' | 'accordion'

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
  gallery_images?: GalleryImage | GalleryImage[] | null
  question_answers?: QuestionAnswer | QuestionAnswer[] | null
  // カスタムページは本体のテーブル名(例: user_make_recipes)がキーになる
  [customPageTable: `user_make_${string}`]: CustomPage | CustomPage[] | null | undefined
}

// 呼び出しコンテンツの実データを種別ごとに配列へそろえたもの
export type CallContentItems =
  | { kind: 'articles', items: Article[] }
  | { kind: 'single_pages', items: SinglePage[] }
  | { kind: 'user_details', items: UserDetail[] }
  | { kind: 'gallery_images', items: GalleryImage[] }
  | { kind: 'question_answers', items: QuestionAnswer[] }
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

// ギャラリー画像の分類(GET /api/gallery-categories の要素)
export interface GalleryCategory {
  id: number
  name: string
}

// ギャラリー画像(GET /api/gallery-images の要素)。category は未分類なら null
export interface GalleryImage {
  id: number
  name: string
  comment: string | null
  image_url: string
  category: GalleryCategory | null
}

// カスタムページの種類(GET /api/custom-page-types の要素)。path は一覧の URL(例: /recipes)
export interface CustomPageType {
  name: string
  label: string
  base_type: 'article' | 'single_page'
  path: string
}

// カスタムフォームの項目(カスタムページの詳細でだけ返る)。value は未入力なら null、チェックボックスは選んだ値の配列
export interface CustomField {
  name: string
  type: 'text' | 'date' | 'textarea' | 'email' | 'select' | 'radio' | 'checkbox'
  value: string | string[] | null
}

interface CustomPageBase {
  id: number
  title: string
  slug: string | null
  path: string
  custom_page_type: CustomPageType
  custom_fields?: CustomField[]
}

// 記事型のカスタムページ(記事と同じ項目名)
export interface CustomArticlePage extends CustomPageBase {
  content: string | null
  thumbnail_url: string | null
  author_name: string | null
  tags: Tag[]
  published_at: string | null
  updated_at: string | null
}

// 固定ページ型のカスタムページ(固定ページと同じ項目名。詳細はカスタムページの詳細でだけ返る)
export interface CustomSinglePage extends CustomPageBase {
  short_sentences: string | null
  header_image_url: string | null
  details?: SinglePageDetail[]
}

export type CustomPage = CustomArticlePage | CustomSinglePage

// パンくずの項目。path が null の項目(公開中のページがない途中の階層)はリンクしない。末尾は表示中のページ
export interface Breadcrumb {
  label: string
  path: string | null
}

// GET /api/resolve のレスポンス。breadcrumbs はトップでは空
export type ResolveResponse = { breadcrumbs: Breadcrumb[] } & (
  | { type: 'top', data: null, call_contents: CallContent[] }
  | { type: 'article', data: Article, call_contents: CallContent[] }
  | { type: 'single_page', data: SinglePage, call_contents: CallContent[] }
  | { type: 'custom_page_list', data: null, custom_page_type: CustomPageType, call_contents: CallContent[] }
  | { type: 'custom_page', data: CustomPage, custom_page_type: CustomPageType, call_contents: CallContent[] }
)

// レイアウトを切り替えるページの種類(カスタムページは記事型を article・固定ページ型を single_page、一覧などは other)
export type LayoutPageType = 'top' | 'article' | 'single_page' | 'other'

export type SidebarPosition = 'none' | 'left' | 'right'

export type LayoutRegion = 'header' | 'sidebar' | 'footer'

// ナビメニューの項目。path はサイト内のパスか外部の URL。prefix が true なら下の階層のページ(例: /recipes/xxx)でも選択中にする
export interface NavMenuItem {
  label: string
  path: string
  prefix: boolean
}

interface LayoutBlockBase {
  // 見出しを持たない部品(サイトタイトルなど)や未設定は null
  title: string | null
  subtitle: string | null
}

// レイアウトの領域に置く部品。サイトタイトル・SNS リンク・コピーライトはサイト設定の値で表示する
export type LayoutBlock = LayoutBlockBase & (
  | { block_type: 'site_title' | 'social_links' | 'copyright' }
  | { block_type: 'nav_menu', items: NavMenuItem[] }
  | { block_type: 'free_text', content: string | null }
  // データ種別がなくなっている場合は null
  | { block_type: 'call_content', call_content: CallContent | null }
)

// GET /api/layout の data
export interface Layout {
  pages: Record<LayoutPageType, { sidebar_position: SidebarPosition, show_breadcrumbs: boolean }>
  regions: Record<LayoutRegion, LayoutBlock[]>
}

// ログイン中のユーザー(マイページ。GET /api/me)。detail はユーザー詳細が未登録なら null
export interface Me {
  id: number
  name: string
  email: string
  // 記事を管理者の承認なしで公開できるか(biscuit の管理画面で設定する)
  skip_approval: boolean
  detail: {
    first_name: string
    family_name: string
    nick_name: string
    birthday: string | null
    comment: string | null
    view_flag: boolean
    name_settings: NameSetting
    user_image_url: string
    skills: UserSkill[]
  } | null
}

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

// マイページの記事の公開ステータス(下書き・承認待ち・公開)
export type ArticleApproval = 'draft' | 'pending' | 'published'

// マイページの記事(GET /api/me/articles)。公開側の記事に、編集と承認の状態に使う値を足したもの
export interface MyArticle {
  id: number
  title: string
  parent_path: string | null
  slug: string | null
  path: string
  content: string | null
  thumbnail_url: string | null
  tags?: Tag[]
  approval: ArticleApproval
  approval_label: string
  // 管理者が下書きに戻したときの理由(承認を申請し直すと消える)
  review_comment: string | null
  publication_start_datetime: string | null
  publication_end_datetime: string | null
  first_published_at: string | null
  created_at: string | null
  updated_at: string | null
}

// 記事の投稿先(biscuit の管理者が登録した親パス。GET /api/me/article-paths)
export interface ArticlePathOption {
  id: number
  label: string
  parent_path: string
}

// 記事の投稿者(名前は投稿者の名前の表示設定に従う)
export interface ArticleAuthor {
  id: number | null
  name: string
  profile_path: string | null
}

// 投稿者ページのプロフィール(GET /api/authors/{id})
export interface Author {
  id: number
  name: string
  profile_path: string
  user_image_url: string | null
  comment: string | null
  skills: UserSkill[]
}
