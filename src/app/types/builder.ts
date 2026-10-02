// biscuit のページビルダーの内容(ノードの木)。biscuit の Support\Builder の定義に合わせる

// デスクトップのスタイルを上書きできる端末
export type BuilderDevice = 'tablet' | 'mobile'

// 表示しない端末に選べる値(デスクトップも選べる)
export type BuilderVisibilityDevice = 'desktop' | 'tablet' | 'mobile'

// スタイル(プロパティ名は camelCase。値は biscuit が許した形の文字列)
export type BuilderStyles = Record<string, string>

export interface BuilderNode {
  // 種類_ULID(例: heading_01K8...)
  id: string
  type: string
  props: Record<string, unknown>
  styles: BuilderStyles
  responsive?: Partial<Record<BuilderDevice, BuilderStyles>>
  // 表示条件。公開側には表示しない端末(hideOn)だけが届く(表示する期間の外のブロックは biscuit が取り除いて返す)
  visibility?: { hideOn?: BuilderVisibilityDevice[] }
  // 中にブロックを置ける種類(section・container・row・column)だけが持つ
  children?: BuilderNode[]
  // CMS のデータを表示するブロックだけが持つ、biscuit が取得の条件どおりに入れたデータ(記事一覧は articles、ナビゲーションは items、ギャラリーは images、動画は embed_url、
  // グローバルコンポーネントは children(コンポーネントの公開中の内容のノード))
  data?: Record<string, unknown>
}

export interface BuilderContent {
  version: number
  children: BuilderNode[]
  // テーマ(biscuit が公開側に返す内容にだけ入れる。色は名前 → #rrggbb)
  theme?: BuilderTheme
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
}
