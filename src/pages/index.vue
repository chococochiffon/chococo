<script setup lang="ts">

</script>
<template>
  <div class="container">
    <!-- item start -->
    <section class="album py-5" data-bs-spy="scroll" data-bs-target="#navbar-example2">
      <!-- about start -->
      <div class="container">
        <div class="row py-5">
          <div class="col-lg-12">
            <div class="text-center mx-1 px-1 mb-4 mp-4">
              <h2 class="fw-bold font-monospace">
                <span id="about" class="underline">About</span>
              </h2>
              <p>このサイトについて</p>
            </div>
          </div>
          <div class="col-lg-12 shadow aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
            <div class="row">
              <div class="col-lg-5">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#55595c"/>
                  <text x="50%" y="50%" fill="#eceeef" dy=".3em">No Image</text>
                </svg>
              </div>
              <div class="col-lg-7 my-4 my-4">
                <h4 class="text-center mb-2 pb-2 font-monospace">実績発表の場として</h4>
                <p class="m-2 p-2 lh-base">
                  このサイトをふくめたプロダクトの発表のためにサイトをつくったよ。<br />
                  フリーランスとしてお仕事を請け負っていく中で、自分のできることを書いておくと便利なんだ。
                </p>
                <p class="m-2 p-2 lh-base">
                  ほかにも動画編集もやってみたくて、ゲームのプレイ動画や Github で公開しているプログラムのつかいかたも動画にするよ。<br>
                  お仕事として動画編集もうけてみたいんだよね～。
                </p>
                <p class="m-2 p-2 lh-base">
                  いままで以上に、ふわふわいきていくためにサイトをつくったってわけ！
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- about end -->
      <!-- profile start -->
      <div class="container">
        <div class="row py-5">
          <div class="col-lg-12">
            <div class="text-center mx-1 px-1 mb-4 mp-4">
              <h2 class="fw-bold font-monospace">
                <span id="profile" class="underline">Profile</span>
              </h2>
              <p>わたしについて</p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card mb-4 shadow aos-init aos-animate" data-aos="fade-right" data-aos-delay="100">
              <div class="card-body text-center">
                <img src="@/assets/image/profile/IMG_4363.png" alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
                <h5 class="my-3">Chococo Chiffon</h5>
                <p class="text-muted mb-1">Full Stack Developer &amp; Gamer</p>
                <p class="text-muted mb-4"></p>
              </div>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="col-md-12">
              <div class="card mb-4 mb-md-0 shadow aos-init aos-animate" data-aos="fade-down" data-aos-delay="100">
                <div class="card-body">
                  <p class="mb-4"><span class="text-primary font-italic me-1">Chococo Chiffon</span>Status
                  </p>
                  <p class="mb-1" style="font-size: .77rem;">Web Design</p>
                  <div class="progress rounded" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Frontend</p>
                  <div class="progress rounded mb-2" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 74%" aria-valuenow="74" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Backend API</p>
                  <div class="progress rounded mb-2" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 98%" aria-valuenow="98" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Video Creator</p>
                  <div class="progress rounded mb-2" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: .77rem;">Games</p>
                  <div class="progress rounded mb-2" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- profile end -->
      <!-- FAQ start -->
      <div class="container">
        <div class="row py-5">
          <div class="col-lg-12">
            <div class="text-center mx-1 px-1 mb-4 mp-4">
              <h2 class="fw-bold font-monospace">
                <span id="faq" class="underline">FAQs</span>
              </h2>
              <p>聞いてみたいこと</p>
            </div>
          </div>
          <div class="col-lg-12">
            <div class="accordion accordion-flush" id="accordionFlushExample">
              <div class="accordion-item shadow p-2 m-3 aos-init aos-animate rounded" data-aos="fade-up" data-aos-delay="200">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed font-weight-bold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    <i class="bi bi-question-circle question-icon"></i><span class="m-1 p-1">結局このサイトってなんなの？</span>
                  </button>
                </h2>
                <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                  <div class="accordion-body">
                    <i class="bi bi-check2 answer-icon"></i><span class="m-1 p-1">ポートフォリオみたいなものだとおもって！</span>
                  </div>
                </div>
              </div>
              <div class="accordion-item shadow p-2 m-3 aos-init aos-animate rounded" data-aos="fade-up" data-aos-delay="200">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                    <i class="bi bi-question-circle question-icon"></i><span class="m-1 p-1">ブログでやれば？</span>
                  </button>
                </h2>
                <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                  <div class="accordion-body">
                    <i class="bi bi-check2 answer-icon"></i><span class="m-1 p-1">やだ！</span>
                  </div>
                </div>
              </div>
              <div class="accordion-item shadow p-2 m-3 aos-init aos-animate rounded" data-aos="fade-up" data-aos-delay="200">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                    <i class="bi bi-question-circle question-icon"></i><span class="m-1 p-1">もっと詳しい DEMO がみたいんだけど？</span>
                  </button>
                </h2>
                <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                  <div class="accordion-body">
                    <i class="bi bi-check2 answer-icon"></i><span class="m-1 p-1"> X (@chococo_chiffon) に DM くれ！</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- FAQ end -->
      <!-- contents start -->
      <div class="container">
        <div class="row py-5">
          <div class="col-lg-12">
            <div class="text-center mx-1 px-1 mb-4 mp-4">
              <h2 class="fw-bold font-monospace">
                <span id="profile" class="underline">Contents</span>
              </h2>
              <p>活動の記録や実績</p>
            </div>
          </div>
          <!-- contents 1 start -->
          <div class="col-lg-4 py-2 my-2">
            <div class="card shadow aos-init aos-animate" data-aos="fade-down" data-aos-delay="100">
              <svg class="bd-placeholder-img card-img-top" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#55595c"/>
                <text x="50%" y="50%" fill="#eceeef" dy=".3em">No Image</text>
              </svg>
              <div class="card-body">
                <p class="card-text">準備中だよ。5月中には…</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                  </div>
                  <small class="text-body-secondary">2024/04/01</small>
                </div>
              </div>
            </div>
          </div>
          <!-- contents 1 end -->
          <!-- contents 2 start -->
          <div class="col-lg-4 py-2 my-2">
            <div class="card shadow aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
              <svg class="bd-placeholder-img card-img-top" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#55595c"/>
                <text x="50%" y="50%" fill="#eceeef" dy=".3em">No Image</text>
              </svg>
              <div class="card-body">
                <p class="card-text">準備中だよ。5月中には…</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                  </div>
                  <small class="text-body-secondary">2024/04/01</small>
                </div>
              </div>
            </div>
          </div>
          <!-- contents 2 end -->
          <!-- contents 3 start -->
          <div class="col-lg-4 py-2 my-2">
            <div class="card shadow aos-init aos-animate" data-aos="fade-down" data-aos-delay="100">
              <svg class="bd-placeholder-img card-img-top" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#55595c"/>
                <text x="50%" y="50%" fill="#eceeef" dy=".3em">No Image</text>
              </svg>
              <div class="card-body">
                <p class="card-text">準備中だよ。5月中には…</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                  </div>
                  <small class="text-body-secondary">2024/04/01</small>
                </div>
              </div>
            </div>
          </div>
          <!-- contents 3 end -->
        </div>
      </div>
      <!-- contents end -->
    </section>
    <!-- item end -->
  </div>
</template>
<style scoped>

</style>