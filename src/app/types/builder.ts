// biscuit のページビルダーの内容(ノードの木)。biscuit の Support\Builder の定義に合わせる

// デスクトップのスタイルを上書きできる端末
export type BuilderDevice = 'tablet' | 'mobile'

// スタイル(プロパティ名は camelCase。値は biscuit が許した形の文字列)
export type BuilderStyles = Record<string, string>

export interface BuilderNode {
  // 種類_ULID(例: heading_01K8...)
  id: string
  type: string
  props: Record<string, unknown>
  styles: BuilderStyles
  responsive?: Partial<Record<BuilderDevice, BuilderStyles>>
  // 中にブロックを置ける種類(section・container・row・column)だけが持つ
  children?: BuilderNode[]
  // CMS のデータを表示するブロックだけが持つ、biscuit が取得の条件どおりに入れたデータ(記事一覧は articles)
  data?: Record<string, unknown>
}

export interface BuilderContent {
  version: number
  children: BuilderNode[]
}
