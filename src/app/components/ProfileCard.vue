<script setup lang="ts">
import { MAX_SKILL_LEVEL, type UserSkill } from '~/types/api'

// プロフィールカード(アイコン・名前のカードと、コメント・スキルを習熟度の星で並べるカード)。
// 呼び出しコンテンツのスキルリストと投稿者ページで使う。親の .row の中に置く
defineProps<{
  // 公開する名前(非表示なら null)
  name: string | null
  imageUrl: string | null
  comment: string | null
  skills: UserSkill[]
}>()
</script>

<template>
  <div class="col-lg-4">
    <div class="card mb-4 shadow" data-aos="fade-right" data-aos-delay="100">
      <div class="card-body text-center">
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="rounded-circle img-fluid avatar">
        <i v-else class="bi bi-person-circle avatar-placeholder text-body-secondary" />
        <h5 v-if="name" class="my-3">{{ name }}</h5>
        <slot name="actions" />
      </div>
    </div>
  </div>
  <div class="col-lg-8">
    <div class="card mb-4 shadow" data-aos="fade-down" data-aos-delay="100">
      <div class="card-body">
        <p v-if="comment" class="lh-base comment" :class="skills.length ? 'mb-4' : 'mb-0'">{{ comment }}</p>
        <template v-if="skills.length">
          <p class="mb-4">
            <span v-if="name" class="text-primary fst-italic me-1">{{ name }}</span>Status
          </p>
          <template v-for="(skill, index) in skills" :key="skill.id">
            <div class="d-flex align-items-center justify-content-between" :class="{ 'mt-3': index > 0 }">
              <p class="mb-0 skill-name">{{ skill.name }}</p>
              <!-- 習熟度を MAX_SKILL_LEVEL 個の星で表示し、習熟度の数だけ塗りつぶす -->
              <span class="text-warning text-nowrap stars" role="img" :aria-label="`${skill.name}: ${skill.level} / ${MAX_SKILL_LEVEL}`">
                <i
                  v-for="star in MAX_SKILL_LEVEL"
                  :key="star"
                  :class="star <= skill.level ? 'bi bi-star-fill' : 'bi bi-star'"
                  aria-hidden="true"
                />
              </span>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  width: 150px;
  aspect-ratio: 1;
  object-fit: cover;
}
.avatar-placeholder {
  font-size: 150px;
  line-height: 1;
}
.comment {
  white-space: pre-line;
}
.skill-name {
  font-size: .77rem;
}
.stars {
  font-size: .85rem;
  letter-spacing: .15em;
}
</style>
