<template>
  <form class="space-y-4 py-4" @submit.prevent="handleRegister">
    <UFormGroup label="이메일" required>
      <div class="relative flex items-center">
        <UInput
          v-model="form.email"
          type="email"
          icon="i-heroicons-envelope"
          placeholder="example@email.com"
          class="flex-1"
          :ui="{ wrapper: 'relative w-full' }"
        />
        <UButton
          label="중복 확인"
          variant="ghost"
          color="primary"
          class="absolute right-2 z-10 text-xs font-bold"
          @click.stop.prevent="handleCheckEmail"
        />
      </div>

      <p v-if="isCheckEmailDone" class="mt-1 text-xs transition-all duration-200" :class="isEmailExisting ? 'text-red-500' : 'text-primary-600'">
        {{ isEmailExisting ? '❌ 이미 가입된 이메일입니다.' : '✅ 사용 가능한 이메일입니다.' }}
      </p>
    </UFormGroup>

    <UFormGroup label="닉네임" required>
      <UInput v-model="form.nickname" icon="i-heroicons-user" placeholder="어떻게 불러 드릴까요?" />
    </UFormGroup>

    <UFormGroup label="비밀번호" required>
      <UInput
        v-model="form.password"
        type="password"
        icon="i-heroicons-lock-closed"
        placeholder="8~16자 영문, 숫자, 특수문자 조합"
        :color="form.password ? (isPasswordValid ? 'primary' : 'red') : 'white'"
      />
      <p v-if="form.password" class="mt-1 text-xs transition-all duration-200" :class="isPasswordValid ? 'text-primary-600' : 'text-red-500'">
        {{ isPasswordValid ? '✅ 안전한 비밀번호입니다.' : '❌ 8~16자 영문, 숫자, 특수문자를 포함해 주세요.' }}
      </p>
    </UFormGroup>

    <UFormGroup label="비밀번호 확인" required>
      <UInput
        v-model="form.password2"
        type="password"
        icon="i-heroicons-check-badge"
        placeholder="비밀번호를 한 번 더 입력해 주세요"
        :color="form.password2 ? (isPasswordMatched ? 'primary' : 'red') : 'white'"
      />
      <p v-if="form.password2" class="mt-1 text-xs transition-all duration-200" :class="isPasswordMatched ? 'text-primary-600' : 'text-red-500'">
        {{ isPasswordMatched ? '✅ 비밀번호가 일치합니다.' : '❌ 비밀번호가 일치하지 않습니다.' }}
      </p>
    </UFormGroup>

    <div class="min-h-[1.5rem] flex items-center">
      <p v-if="errorMsg" class="text-sm font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
        <UIcon name="i-heroicons-exclamation-circle" class="inline-block mr-1" />
        {{ errorMsg }}
      </p>
    </div>

    <UButton type="submit" block :loading="loading" class="rounded-full shadow-md">가입하기</UButton>
  </form>
</template>

<script setup>
const form = reactive({ email: '', nickname: '', password: '', password2: '' })
const loading = ref(false)
const errorMsg = ref('')
const isEmailExisting = ref(false)
const isCheckEmailDone = ref(false)

watch(() => form.email, () => {
  isCheckEmailDone.value = false
  isEmailExisting.value = false
})

const isPasswordValid = computed(() => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
  return passwordRegex.test(form.password)
})

const isPasswordMatched = computed(() => {
  return form.password && form.password === form.password2
})

const handleCheckEmail = async () => {
  if (!form.email) {
    return
  }

  errorMsg.value = ''
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email })
    });

    const data = await response.json()

    isEmailExisting.value = data > 0
    isCheckEmailDone.value = true

  } catch (err) {
    errorMsg.value = '이메일 확인 중 오류가 발생했습니다.'
  }
}

const handleRegister = async () => {
  errorMsg.value = ''

  if (!form.email || !form.nickname || !form.password || !form.password2) {
    errorMsg.value = '모든 정보를 채워 주세요.'
    return
  }

  if (!isCheckEmailDone.value) {
    errorMsg.value = '이메일 중복 확인을 진행해 주세요.'
    return
  }

  if (isEmailExisting.value) {
    errorMsg.value = '이미 사용 중인 이메일입니다.'
    return
  }

  if (!isPasswordValid.value) {
    errorMsg.value = '비밀번호 규칙을 확인해 주세요.'
    return
  }

  if (!isPasswordMatched.value) {
    errorMsg.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  loading.value = true
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (response.status === 409) {
      errorMsg.value = '이미 사용 중인 닉네임입니다.'
      return;
    }

    if (!response.ok) throw new Error('가입에 실패했습니다. 정보를 확인해 주세요.')

    alert(`${form.nickname} 님, 환영합니다!`)
    navigateTo('/login')
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
