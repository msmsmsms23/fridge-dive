<template>
  <UCard class="mt-4">
    <template #header>
      <UInput v-model="email" class="mb-3" type="email" placeholder="이메일" />
      <UInput v-model="nickname" class="mb-3" placeholder="닉네임" />
      <UInput v-model="password" class="mb-3" type="password" placeholder="비밀번호" />
      <UInput v-model="password2" class="mb-3" :disabled="!password" type="password" placeholder="비밀번호 확인" />
      <UButton @click="register">계정 만들기</UButton>
    </template>
    <template #default>
      <div class="text-customGray-600">
        이미 계정이 있으신가요?
        <UButton to="/auth/login">로그인</UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup>
const email = ref('')
const nickname = ref('')
const password = ref('')
const password2 = ref('')

const reset = () => {
  email.value = '';
  nickname.value = '';
  password.value = '';
  password2.value = '';
}

const createRandomCode = () => {
  const verificationCode = []

  for (let i = 0; i < 6; i++) {
    verificationCode.push(Math.floor(Math.random() * 10))
  }

  return verificationCode.join('')
}

const register = async () => {
  const registerForm = {
    email: email.value,
    nickname: nickname.value,
    password: password.value,
    password2: password2.value,
    enabled: true,
    //verificationCode: createRandomCode()
  }

  const values = Object.values(registerForm)

  try {
    // if (!values.every(v => v)) {
    if (!email.value || !nickname.value || !password.value || !password2.value) {
      throw new Error("error empty value");
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerForm)
    });

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    alert(`회원가입을 환영합니다, ${nickname.value} 님!`)
    //window.location.href = `/${username.value}/verify`

  } catch (err) {
    alert(err.message)
    throw err
  }
}
</script>
