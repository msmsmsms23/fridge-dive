<template>
  <UButton
    v-if="userStore.user && userStore.user.id !== targetUserId"
    :variant="isFollowed ? 'ghost' : 'soft'"
    :color="isFollowed ? 'gray' : 'primary'"
    :icon="isFollowed ? 'i-heroicons-check' : 'i-heroicons-plus'"
    size="2xs"
    class="rounded-full transition-all"
    :loading="loading"
    @click.stop="toggleFollow"
  >
    {{ isFollowed ? '팔로잉' : '팔로우' }}
  </UButton>
</template>

<script setup>
const props = defineProps({
  targetUserId: {
    type: Number,
    required: true
  }
});

const userStore = useUserStore();
const loading = ref(false);
const isFollowed = ref(false);

const { data: followStatus } = await useFetch('/api/follows', {
  query: { followingId: props.targetUserId },
  watch: [() => props.targetUserId]
});

watchEffect(() => {
  if (followStatus.value) {
    isFollowed.value = followStatus.value.followed;
  }
});

const toggleFollow = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await $fetch('/api/follows', {
      method: 'POST',
      body: { followingId: props.targetUserId }
    });
    isFollowed.value = res.followed;
  } catch (e) {
    console.error('Follow Error:', e);
  } finally {
    loading.value = false;
  }
};
</script>
