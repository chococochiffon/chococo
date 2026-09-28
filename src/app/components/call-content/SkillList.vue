<script setup lang="ts">
import { MAX_SKILL_LEVEL, type UserDetail } from '~/types/api'

// スキルリスト: ユーザー詳細をプロフィールカードで表示し、スキルを習熟度の星で並べる(旧 Profile セクションのデザイン)
defineProps<{
  title: string | null
  subtitle: string | null
  userDetails: UserDetail[]
}>()
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="title" :subtitle="subtitle" />
      <template v-for="userDetail in userDetails" :key="userDetail.id">
        <div class="col-lg-4">
          <div class="card mb-4 shadow" data-aos="fade-right" data-aos-delay="100">
            <div class="card-body text-center">
              <img
                v-if="userDetail.user_image_url"
                :src="userDetail.user_image_url"
                alt="avatar"
                class="rounded-circle img-fluid avatar"
              >
              <i v-else class="bi bi-person-circle avatar-placeholder text-body-secondary" />
              <h5 v-if="userDisplayName(userDetail)" class="my-3">{{ userDisplayName(userDetail) }}</h5>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card mb-4 shadow" data-aos="fade-down" data-aos-delay="100">
            <div class="card-body">
              <p v-if="userDetail.comment" class="lh-base comment" :class="userDetail.skills?.length ? 'mb-4' : 'mb-0'">{{ userDetail.comment }}</p>
              <template v-if="userDetail.skills?.length">
                <p class="mb-4">
                  <span v-if="userDisplayName(userDetail)" class="text-primary fst-italic me-1">{{ userDisplayName(userDetail) }}</span>Status
                </p>
                <template v-for="(skill, index) in userDetail.skills" :key="skill.id">
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
