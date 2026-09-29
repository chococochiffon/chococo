<script setup lang="ts">
import type { UserDetail } from '~/types/api'

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
      <ProfileCard
        v-for="userDetail in userDetails"
        :key="userDetail.id"
        :name="userDisplayName(userDetail)"
        :image-url="userDetail.user_image_url"
        :comment="userDetail.comment"
        :skills="userDetail.skills ?? []"
      />
    </div>
  </div>
</template>
