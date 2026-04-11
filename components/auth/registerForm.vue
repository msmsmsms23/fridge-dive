<template>
  <form class="space-y-4 py-4" @submit.prevent="handleRegister">
    <UFormGroup label="이메일" required>
      <UInput v-model="form.email" type="email" />
    </UFormGroup>
    <UFormGroup label="닉네임" required>
      <UInput v-model="form.nickname" />
    </UFormGroup>
    <UFormGroup label="비밀번호" required>
      <UInput v-model="form.password" type="password" />
    </UFormGroup>
    <UFormGroup label="비밀번호 확인" required>
      <UInput v-model="form.password2" type="password" />
    </UFormGroup>
    <UButton type="submit" block color="green" :loading="loading">가입하기</UButton>
  </form>
</template>

<script setup>
const form = reactive({ email: '', nickname: '', password: '', password2: '' })
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    if (!form) {
      throw new Error("error empty value");
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    alert(`Welcome to Instagram, ${form.nickname}!`)

  } catch (err) {
    alert(err.message)
    throw err
  }

  loading.value = false
}
</script>
