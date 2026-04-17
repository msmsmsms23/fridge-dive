<template>
  <UTabs v-model="selectedTab" :items="authTabs">
    <template #login-slot>
      <AuthLoginForm />
    </template>
    <template #register-slot>
      <AuthRegisterForm />
    </template>
  </UTabs>
</template>

<script setup>
const route = useRoute();

const authTabs = [
  { label: '로그인', slot: 'login-slot' },
  { label: '회원가입', slot: 'register-slot' }
]

const selectedTab = ref(0);

onMounted(() => {
  if (route.query.tab) {
    selectedTab.value = Number(route.query.tab);
  }
});

watch(() => route.query.tab, (newTab) => {
  selectedTab.value = Number(newTab) || 0;
});
</script>
