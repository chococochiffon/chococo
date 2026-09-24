<script setup lang="ts">
import type { UserDetail } from '~/types/api'

// スキルリスト: ユーザー詳細をプロフィールカードで表示する(旧 Profile セクションのデザイン)
// TODO: スキル(項目名と習熟度)は biscuit 側にデータができたらプログレスバーで表示する
defineProps<{
  heading: string
  userDetails: UserDetail[]
}>()
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="heading" subtitle="わたしについて" />
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
              <p class="mb-0 lh-base comment">{{ userDetail.comment }}</p>
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
</style>
