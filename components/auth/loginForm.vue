<template>
  <form class="space-y-4 py-4" @submit.prevent="handleLogin">
    <UFormGroup label="이메일" required>
      <UInput v-model="form.email" type="email" icon="i-heroicons-envelope" />
    </UFormGroup>
    <UFormGroup label="비밀번호" required>
      <UInput v-model="form.password" type="password" icon="i-heroicons-lock-closed" />
    </UFormGroup>
    <UButton type="submit" block :loading="loading">로그인</UButton>
  </form>
</template>

<script setup>
const userStore = useUserStore();

const form = reactive({ email: '', password: '' })
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: form });
    await userStore.fetchCurrentUser();
    alert('반가워요!')
    navigateTo('/')
  } finally {
    loading.value = false
  }
}
</script>
