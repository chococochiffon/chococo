<script setup lang="ts">
import type { UserDetail } from '~/types/api'

// スキルリスト: ユーザー詳細をプロフィールカードで表示し、スキルを習熟度のバーで並べる(旧 Profile セクションのデザイン)
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
                  <p class="mb-1 skill-name" :class="{ 'mt-4': index > 0 }">{{ skill.name }}</p>
                  <div
                    class="progress rounded"
                    role="progressbar"
                    :aria-label="skill.name"
                    :aria-valuenow="skill.level"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div class="progress-bar" :style="{ width: `${skill.level}%` }" />
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
.progress {
  height: 5px;
}
</style>
