<template>
  <form class="space-y-4 py-4" @submit.prevent="handleLogin">
    <UFormGroup label="이메일" required>
      <UInput v-model="form.email" type="email" icon="i-heroicons-envelope" placeholder="example@email.com" />
    </UFormGroup>

    <UFormGroup label="비밀번호" required>
      <UInput v-model="form.password" type="password" icon="i-heroicons-lock-closed" placeholder="비밀번호를 입력하세요" />
    </UFormGroup>

    <div class="min-h-[1.5rem] flex items-center">
      <p v-if="incorrect" class="text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
        <UIcon name="i-heroicons-exclamation-circle" class="inline-block mr-1" />
        이메일이나 비밀번호가 일치하지 않습니다.
      </p>
      <p v-else-if="blink" class="text-sm text-primary-600 font-medium animate-in fade-in slide-in-from-top-1">
        <UIcon name="i-heroicons-information-circle" class="inline-block mr-1" />
        로그인을 위해 이메일과 비밀번호를 모두 채워 주세요.
      </p>
    </div>

    <UButton type="submit" block :loading="loading" class="rounded-full shadow-md">로그인</UButton>
  </form>
</template>

<script setup>
const userStore = useUserStore();

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const blink = ref(false)
const incorrect = ref(false)

const handleLogin = async () => {
  blink.value = false
  incorrect.value = false

  if (!form.email || !form.password) {
    blink.value = true
    return
  }

  loading.value = true

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    if (response.status === 401 || response.status === 404) {
      incorrect.value = true;
      return;
    }

    await userStore.fetchCurrentUser();
    const data = await response.json();
    alert(`${data.nickname} 님, 환영합니다!`);
    navigateTo('/')
  } finally {
    loading.value = false
  }
}
</script>
