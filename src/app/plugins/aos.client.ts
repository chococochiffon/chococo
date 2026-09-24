// スクロールアニメーション(AOS)を初期化し、ページ遷移のたびに新しい要素を拾い直す。
// AOS は要素にクラスを付けるため、ハイドレーションとずれないようハイドレーション完了後に初期化する
import AOS from 'aos'

export default defineNuxtPlugin((nuxtApp) => {
  let initialized = false

  onNuxtReady(() => {
    AOS.init({ once: true, duration: 600 })
    initialized = true
  })

  nuxtApp.hook('page:finish', () => {
    if (initialized) {
      AOS.refreshHard()
    }
  })
})
