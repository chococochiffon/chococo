// ページごとの設定(definePageMeta)に足す項目
declare module '#app' {
  interface PageMeta {
    // false にすると、ヘッダーはサイトタイトルだけにする(ナビメニュー・SNS リンク・マイページへのリンクを出さない。ログイン画面など)
    headerNavigation?: boolean
  }
}

export {}
