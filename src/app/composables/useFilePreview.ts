// 選んだ画像のファイルと、保存するまで手元で見せるプレビューの URL(object URL)。
// 選び直したとき・外したとき・画面を離れるときに、前の URL を解放する
export function useFilePreview() {
  const file = ref<File | null>(null)
  const preview = ref<string | null>(null)

  function select(selected: File | null): void {
    if (preview.value) {
      URL.revokeObjectURL(preview.value)
    }

    file.value = selected
    preview.value = selected ? URL.createObjectURL(selected) : null
  }

  onBeforeUnmount(() => select(null))

  return { file, preview, select }
}
