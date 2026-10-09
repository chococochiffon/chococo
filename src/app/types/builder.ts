// biscuit のページビルダーの内容(ノードの木)。biscuit の Support\Builder の定義に合わせる

// デスクトップのスタイルを上書きできる端末
export type BuilderDevice = 'tablet' | 'mobile'

// 表示しない端末に選べる値(デスクトップも選べる)
export type BuilderVisibilityDevice = 'desktop' | 'tablet' | 'mobile'

// スタイル(プロパティ名は camelCase。値は biscuit が許した形の文字列)
export type BuilderStyles = Record<string, string>

// 自由配置(内容の v2)のブロックの位置と大きさ(biscuit の Support\Builder\BuilderLayout)。
// x・w は面の中身の幅に対する %、y・h は px。h は画像・ボックスだけが持つ
export interface BuilderLayoutBox {
  x: number
  y: number
  w: number
  h?: number
}

// 端末ごとの位置(デスクトップは必須。タブレットはなければデスクトップの値、スマートフォンはなければ縦 1 列に並べる)
export type BuilderLayout = { desktop: BuilderLayoutBox } & Partial<Record<BuilderDevice, BuilderLayoutBox>>

export interface BuilderNode {
  // 種類_ULID(例: heading_01K8...)
  id: string
  type: string
  props: Record<string, unknown>
  styles: BuilderStyles
  responsive?: Partial<Record<BuilderDevice, BuilderStyles>>
  // 追加のクラス名(Custom CSS から狙う)
  classes?: string[]
  // 表示条件。公開側には表示しない端末(hideOn)だけが届く(表示する期間の外のブロックは biscuit が取り除いて返す)
  visibility?: { hideOn?: BuilderVisibilityDevice[] }
  // 自由配置(v2)の面(セクション・ボックス・独自コンポーネントの一番外側)の直下のブロックだけが持つ
  layout?: BuilderLayout
  // 中にブロックを置ける種類(section・container・row・column・box など)だけが持つ
  children?: BuilderNode[]
  // CMS のデータを表示するブロックだけが持つ、biscuit が取得の条件どおりに入れたデータ(記事一覧は articles、ナビゲーションは items、ギャラリーは images、動画は embed_url、
  // グローバルコンポーネントは children(コンポーネントの公開中の内容のノード)、独自コンポーネントは children(差し替えた値を当てはめた部品のノード)。
  // コンポーネントは中身の内容の版 version も持つ(ページと違うことがある))
  data?: Record<string, unknown>
}

export interface BuilderContent {
  version: number
  children: BuilderNode[]
  // テーマ(biscuit が公開側に返す内容にだけ入れる。色は名前 → #rrggbb)
  theme?: BuilderTheme
  // ページの Custom CSS(.page-builder の中にネストして効かせる)
  css?: string
}

// テーマのフォント(Google Fonts。family は CSS の font-family、href は読み込む CSS)
export interface BuilderThemeFont {
  key: string
  family: string
  href: string
}

// ページビルダーのテーマ(biscuit の PageBuilderTheme::toPresentation())。ビルダーのブロックにだけ効く
export interface BuilderTheme {
  colors: Record<string, string>
  fonts: { heading: BuilderThemeFont | null, body: BuilderThemeFont | null }
  // サイト共通の Custom CSS
  css?: string | null
}
