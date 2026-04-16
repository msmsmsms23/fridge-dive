<template>
  <div class="flex flex-wrap gap-2 py-4">
    <UButton
      v-for="(label, emoji) in emojiList"
      :key="emoji"
      :variant="hasReacted(emoji) ? 'outline' : 'soft'"
      :color="hasReacted(emoji) ? 'primary' : 'gray'"
      size="sm"
      class="rounded-full transition-all hover:scale-110"
      :disabled="isOwner"
      @click="handleReaction(emoji)"
    >
      <span class="mr-1">{{ emoji }}</span>
      <span class="text-xs font-bold">{{ getCount(emoji) }}</span>
    </UButton>
  </div>
</template>

<script setup>
const props = defineProps({
  logId: { type: Number, required: true },
  ownerId: { type: Number, required: true },
  reactions: { type: Array, default: () => [] }
});

const emit = defineEmits(['refresh']);
const userStore = useUserStore();

const emojiList = {
  '😋': '맛있겠다',
  '🤤': '군침돌아요',
  '👍': '최고예요',
  '✨': '플레이팅 대박',
  '🔥': '요리 고수'
};

const isOwner = computed(() => userStore.user?.id === props.ownerId);

const getCount = (emoji) => {
  return props.reactions.filter(r => r.emoji === emoji).length;
};

const hasReacted = (emoji) => {
  if (!userStore.user) return false;
  return props.reactions.some(r => r.emoji === emoji && r.userId === userStore.user.id);
};

const handleReaction = async (emoji) => {
  if (!userStore.user) {
    alert('로그인이 필요한 기능입니다.');
    return;
  }

  if (isOwner.value) return;

  try {
    await $fetch(`/api/logs/${props.logId}/reactions`, {
      method: 'POST',
      body: { emoji }
    });
    emit('refresh');
  } catch (e) {
    console.error('Reaction Error:', e);
  }
};
</script>
