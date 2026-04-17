<template>
  <UCard class="mt-3" :ui="{ body: { padding: 'sm:p-8' } }">
    <template #header>
      <h3 class="text-lg font-bold">프로필 설정</h3>
    </template>

    <div class="space-y-6">
      <UFormGroup label="닉네임" description="서비스에서 사용할 이름을 입력해 주세요.">
        <UInput
          v-model="nickname"
          :placeholder="userStore.user?.nickname || '닉네임을 입력하세요'"
          icon="i-heroicons-user"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="이메일" description="이메일은 수정할 수 없습니다. 관리자에게 문의하세요.">
        <UInput
          :placeholder="userStore.user?.email"
          disabled
          icon="i-heroicons-envelope"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="비밀번호" description="보안을 위해 주기적으로 변경하는 것이 좋습니다.">
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div class="text-sm text-gray-600">내 계정 비밀번호 변경</div>
          <UButton
            label="비밀번호 변경"
            color="white"
            variant="solid"
            icon="i-heroicons-key"
            @click="isPasswordModalOpen = true"
          />
        </div>
      </UFormGroup>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div class="pr-3">
          <UButton
            label="회원 탈퇴"
            color="red"
            size="lg"
            class="px-4"
            variant="ghost"
            @click="userStore.deleteUser(userStore.user.id)"
          />
        </div>
        <div class="">
          <UButton
            label="회원정보 저장"
            color="primary"
            size="lg"
            class="px-8"
            @click="userStore.updateUser(nickname)"
          />
        </div>
      </div>
    </template>

    <ChangePasswordModal
      v-model="isPasswordModalOpen"
      @success="onPasswordSuccess"
    />
  </UCard>
</template>

<script setup>
import { useUserStore } from '~/stores/user';
import ChangePasswordModal from '~/components/ChangePasswordModal.vue';

const userStore = useUserStore();
const toast = useToast();
const isPasswordModalOpen = ref(false);

const nickname = ref(userStore.user?.nickname || '');

const onPasswordSuccess = () => {
  toast.add({
    title: '비밀번호 변경 성공!',
    color: 'green',
    icon: 'i-heroicons-check-circle'
  });
};
</script>
