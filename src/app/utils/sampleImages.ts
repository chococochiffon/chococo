import type { GalleryImage } from '~/types/api'

// 公開側に置いている既定の画像(public/image/ 配下)。
// トップのスライダー画像が未登録のときのメインビジュアルと、ギャラリーの画像が 1 枚もないときの見本に使う

export const DEFAULT_HEADER_IMAGES = [
  '/image/header/header_001.jpg',
  '/image/header/header_002.jpg',
  '/image/header/header_003.jpg',
]

// 見本のギャラリー画像(biscuit の画像と重ならないよう、id は負の数にする)
export const SAMPLE_GALLERY_IMAGES: GalleryImage[] = [
  { id: -1, name: '海の見える作業机', comment: '朝の光が入る、窓辺のワークスペースです。', image_url: '/image/gallery/gallery_001.jpg', category: null },
  { id: -2, name: '夜景と作業机', comment: '街の明かりを眺めながら作業する夜のデスクです。', image_url: '/image/gallery/gallery_002.jpg', category: null },
  { id: -3, name: '白いワークスペース', comment: '高層ビルを望む、明るい白の作業机です。', image_url: '/image/gallery/gallery_003.jpg', category: null },
  { id: -4, name: '夕焼けの作業机', comment: '夕日の沈む海を眺めるデスクです。', image_url: '/image/gallery/gallery_004.jpg', category: null },
]
