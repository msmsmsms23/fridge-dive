<template>
  <UCard class="mt-4">
    <template #header>
      <UInput v-model="email" class="mb-3"
              placeholder="이메일" @keydown.enter="login"/>
      <UInput v-model="password" class="mb-3" type="password"
              placeholder="비밀번호" @keydown.enter="login"/>
      <UButton @click="login">로그인</UButton>
    </template>
    <template #default>
      <div class="text-customGray-600">
        냉장고 파먹기가 처음이신가요?
        <UButton to="registration">회원가입 하러 가기</UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup>
import {useUserStore} from "~/stores/user.js";
const router = useRouter();

const email = ref('')
const password = ref('')

const reset = () => {
  email.value = ''
  password.value = ''
}

const login = async () => {
  const loginForm = {
    email: email.value,
    password: password.value
  }

  const values = Object.values(loginForm)

  try {
    if (!values.every(v => v)) {
      throw new Error("error empty value");
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginForm)
    });

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    setTimeout(async () => {
      await useUserStore().fetchCurrentUser()
      //await router.push('/')
    }, 500)

  } catch (err) {
    alert(err.message)
    throw err
  }
}
</script>
