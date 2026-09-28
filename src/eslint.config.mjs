// @ts-check
// Nuxt の設定(@nuxt/eslint が .nuxt/eslint.config.mjs に生成する)をもとにした ESLint の設定
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // テンプレートは短い要素を 1 行に書く(属性ごとの改行・要素の中身の改行を強制しない)
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    // 型の共用体は「=」を行末に置き、「|」を行頭に並べる
    '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
  },
})
