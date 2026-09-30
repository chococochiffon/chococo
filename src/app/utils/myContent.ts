// マイページで扱う、自分の記事・ギャラリーの画像の共通の処理(ダッシュボードの一覧などで使う)

export type MyContentType = 'article' | 'gallery_image'

// 種類の表示名
export const myContentTypeLabels: Record<MyContentType, string> = {
  article: '記事',
  gallery_image: 'ギャラリー',
}

/**
 * マイページの編集画面のパス。
 */
export function myContentEditPath(item: { type: MyContentType, id: number }): string {
  return item.type === 'article' ? `/mypage/articles/${item.id}` : `/mypage/gallery/${item.id}`
}
