<template>
  <h1>냉장고 파먹기</h1>
  <Login />
  <Registration />
  <UButton @click="userStore.logout">로그아웃</UButton>

</template>

<script setup>
import { useUserStore } from '~/stores/user.js';
import Login from "~/pages/auth/login.vue";
import Registration from "~/pages/auth/registration.vue";

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchCurrentUser()

  // if (userStore.user) {
  //   await userStore.getUser()
  // }
})
</script>
