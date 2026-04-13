<template>
  <UTabs :items="authTabs">
    <template #login-slot>
      <AuthLoginForm />
    </template>
    <template #register-slot>
      <AuthRegisterForm />
    </template>
  </UTabs>
</template>

<script setup>
const authTabs = [
  { label: '로그인', slot: 'login-slot' },
  { label: '회원가입', slot: 'register-slot' }
]
</script>
ㅈ
