<template>
  <UModal v-model="modelValue">
    <UCard :ui="{ divide: 'divide-y divide-gray-100' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-gray-900">비밀번호 변경</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="modelValue = false" />
        </div>
      </template>

      <div class="p-1 space-y-5">
        <UFormGroup label="새 비밀번호" required>
          <UInput
            v-model="password"
            type="password"
            icon="i-heroicons-lock-closed"
            placeholder="8~16자 영문, 숫자, 특수문자 조합"
            size="md"
            :color="password ? (isPasswordValid ? 'primary' : 'red') : 'white'"
          />
          <p v-if="password" class="mt-1.5 text-xs flex items-center gap-1" :class="isPasswordValid ? 'text-primary-600' : 'text-red-500'">
            <UIcon :name="isPasswordValid ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" />
            {{ isPasswordValid ? '안전한 비밀번호입니다.' : '8~16자 영문, 숫자, 특수문자를 포함해 주세요.' }}
          </p>
        </UFormGroup>

        <UFormGroup label="비밀번호 확인" required>
          <UInput
            v-model="password2"
            type="password"
            icon="i-heroicons-check-badge"
            placeholder="비밀번호를 한 번 더 입력해 주세요"
            size="md"
            :color="password2 ? (isPasswordMatched ? 'primary' : 'red') : 'white'"
          />
          <p v-if="password2" class="mt-1.5 text-xs flex items-center gap-1" :class="isPasswordMatched ? 'text-primary-600' : 'text-red-500'">
            <UIcon :name="isPasswordMatched ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" />
            {{ isPasswordMatched ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
          </p>
        </UFormGroup>

        <div class="h-6 mt-2">
          <p v-if="errorMsg" class="text-sm font-medium text-red-500 flex items-center gap-1">
            <UIcon name="i-heroicons-exclamation-triangle" />
            {{ errorMsg }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton label="취소" color="gray" variant="ghost" @click="modelValue = false" />
          <UButton
            label="변경 완료"
            color="primary"
            class="px-6"
            :disabled="!isPasswordValid || !isPasswordMatched"
            @click="handleSave"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import {useUserStore} from "~/stores/user.js";

const modelValue = defineModel({ type: Boolean, default: false });
const emit = defineEmits(['success']);
const errorMsg = ref('')
const loading = ref(false)

const userStore = useUserStore();

const password = ref('');
const password2 = ref('');

watch(modelValue, (newVal) => {
  if (!newVal) {
    password.value = '';
    password2.value = '';
    errorMsg.value = '';
  }
});

const isPasswordMatched = computed(() => password.value.length > 0 && password.value === password2.value);

const isPasswordValid = computed(() => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
  return passwordRegex.test(password.value)
})

const handleSave = async () => {
  errorMsg.value = ''

  if (!password.value || !password2.value) {
    errorMsg.value = '모든 정보를 채워 주세요.'
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
    await userStore.changePassword(password.value, password2.value);

    emit('success');
    modelValue.value = false;
  } catch (err) {
    const code = err.message;

    if (code === 'PASSWORD_MISMATCH') {
      errorMsg.value = "비밀번호가 일치하지 않습니다."
    } else if (code === 'SAME_AS_OLD') {
      errorMsg.value = "이전 비밀번호와 동일한 비밀번호는 사용할 수 없습니다."
    } else {
      errorMsg.value = "비밀번호 변경 중 오류가 발생했습니다."
    }

  } finally {
    loading.value = false;
  }
};
</script>
