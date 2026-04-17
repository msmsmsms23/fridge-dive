<template>
  <UContainer class="py-10">
    <UCard class="max-w-4xl mx-auto shadow-xl">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-left"
              @click="goBack"
            />
            <h2 class="text-xl font-bold text-gray-900">레시피 수정하기</h2>
          </div>
          <UButton
            color="red"
            variant="soft"
            icon="i-heroicons-trash"
            label="삭제"
            @click="confirmDelete"
          />
        </div>
      </template>

      <form class="space-y-10" @submit.prevent="updateRecipe">
        <section class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-document-text" class="text-primary-500 w-5 h-5" />
            <h3 class="font-bold text-lg">기본 정보</h3>
          </div>
          <UFormGroup label="레시피 제목" required>
            <UInput v-model="form.title" placeholder="예: 매콤 달콤 떡볶이" size="lg" />
          </UFormGroup>
          <UFormGroup label="레시피 설명">
            <UTextarea v-model="form.description" placeholder="이 레시피만의 특별한 팁이 있나요?" autoresize />
          </UFormGroup>
          <UFormGroup label="공개 범위 설정">
            <USelectMenu
              :model-value="getVisibilityOption(form.isPublic)"
              :options="visibilityOptions"
              @update:model-value="updateVisibility"
            >
              <template #label>
                <div class="flex items-center gap-2">
                  <UIcon :name="getVisibilityOption(form.isPublic).icon" class="w-4 h-4" />
                  <span>{{ getVisibilityOption(form.isPublic).label }}</span>
                </div>
              </template>
            </USelectMenu>
            <p class="mt-1 text-xs text-gray-500">
              {{ getVisibilityOption(form.isPublic).description }}
            </p>
          </UFormGroup>
        </section>

        <UDivider />

        <section class="space-y-4">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-shopping-cart" class="text-primary-500 w-5 h-5" />
              <h3 class="font-bold text-lg">재료 수정</h3>
            </div>
            <UButton
              icon="i-heroicons-plus"
              size="xs"
              variant="ghost"
              label="재료 추가"
              @click="addIngredient"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(ing, index) in form.ingredients"
              :key="index"
              class="flex gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 items-center"
            >
              <UInput v-model="ing.name" placeholder="재료명" class="flex-1" size="sm" />
              <UInput v-model="ing.amount" placeholder="양" class="w-24" size="sm" />
              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-x-mark"
                size="xs"
                @click="removeIngredient(index)"
              />
            </div>
          </div>
        </section>

        <UDivider />

        <section class="space-y-4">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-list-bullet" class="text-primary-500 w-5 h-5" />
              <h3 class="font-bold text-lg">조리 단계</h3>
              <UBadge color="gray" variant="soft" size="xs">드래그하여 순서 변경</UBadge>
            </div>
            <UButton
              icon="i-heroicons-plus"
              size="xs"
              variant="ghost"
              label="단계 추가"
              @click="addStep"
            />
          </div>

          <draggable
            v-model="form.steps"
            item-key="tempId"
            handle=".drag-handle"
            ghost-class="bg-primary-50"
            drag-class="shadow-2xl"
            class="space-y-4"
          >
            <template #item="{ element, index }">
              <div class="p-5 border rounded-2xl bg-white shadow-sm hover:border-primary-200 transition-colors relative group">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded">
                      <UIcon name="i-heroicons-bars-3" class="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                    </div>
                    <span class="font-black text-primary-500 italic text-xl">Step {{ index + 1 }}</span>
                  </div>
                  <UButton
                    color="red"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    size="sm"
                    @click="removeStep(index)"
                  />
                </div>

                <div class="space-y-4">
                  <UTextarea
                    v-model="element.instruction"
                    placeholder="이 단계에서 무엇을 해야 하나요?"
                    autoresize
                    :rows="2"
                  />
                  <div class="flex items-center gap-3 bg-gray-100 w-fit px-3 py-1.5 rounded-full">
                    <UIcon name="i-heroicons-clock" class="text-primary-400 w-4 h-4" />
                    <span class="text-xs font-bold text-primary-600">타이머 설정:</span>
                    <UInput
                      v-model.number="element.timerSeconds"
                      type="number"
                      size="xs"
                      class="w-20"
                      variant="none"
                      placeholder="0"
                    />
                    <span class="text-xs text-primary-400">초</span>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </section>

        <div class="flex gap-4 pt-6 border-t">
          <UButton
            type="submit"
            color="primary"
            size="xl"
            block
            class="flex-1 font-bold"
            :loading="loading"
          >
            수정 내용 저장하기
          </UButton>
          <UButton
            variant="soft"
            color="gray"
            size="xl"
            class="px-8"
            @click="goBack"
          >
            취소
          </UButton>
        </div>
      </form>
    </UCard>
  </UContainer>
</template>

<script setup>
import draggable from 'vuedraggable'

const route = useRoute();
const recipeId = route.params.id;
const loading = ref(false);

const visibilityOptions = [
  { label: '나만 보기', value: 'private', icon: 'i-heroicons-lock-closed', description: '나의 레시피함에만 보관합니다.' },
  { label: '친구 공개', value: 'friends', icon: 'i-heroicons-user-group', description: '나를 팔로우하는 친구들에게만 공개합니다.' },
  { label: '전체 공개', value: 'public', icon: 'i-heroicons-globe-americas', description: '커뮤니티 모든 사용자가 볼 수 있습니다.' }
];

const form = ref({
  title: '',
  description: '',
  isPublic: '',
  ingredients: [],
  steps: []
});

const { data: recipeResponse } = await useFetch(`/api/recipes/${recipeId}`);

onMounted(() => {
  if (recipeResponse.value?.data) {
    const d = recipeResponse.value.data;
    form.value = {
      title: d.title,
      description: d.description || '',
      isPublic: d.isPublic || 'public',
      ingredients: d.ingredients.map(i => ({ name: i.name, amount: i.amount })),
      steps: d.steps.map((s, idx) => ({
        tempId: `step-${Date.now()}-${idx}`,
        instruction: s.instruction,
        timerSeconds: s.timerSeconds || 0
      }))
    };
  }
});

const getVisibilityOption = (val) => {
  return visibilityOptions.find(opt => opt.value === val) || visibilityOptions[2];
};

const updateVisibility = (option) => {
  form.value.isPublic = option.value;
};

const addIngredient = () => {
  form.value.ingredients.push({ name: '', amount: '' });
};

const removeIngredient = (index) => {
  form.value.ingredients.splice(index, 1);
};

const addStep = () => {
  form.value.steps.push({
    tempId: `step-${Date.now()}`,
    instruction: '',
    timerSeconds: 0
  });
};

const removeStep = (index) => {
  form.value.steps.splice(index, 1);
};

const updateRecipe = async () => {
  if (!form.value.title.trim()) return alert('제목은 필수입니다!');

  loading.value = true;
  try {
    await $fetch(`/api/recipes/${recipeId}`, {
      method: 'PATCH',
      body: form.value
    });
    alert('레시피가 성공적으로 업데이트되었습니다! ✨');
    navigateTo(`/recipes/${recipeId}`);
  } catch (e) {
    console.error(e);
    alert('저장 중 오류가 발생했습니다.');
  } finally {
    loading.value = false;
  }
};

const confirmDelete = async () => {
  if (!confirm('정말 이 레시피를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.')) return;

  try {
    await $fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });
    alert('삭제되었습니다.');
    navigateTo('/');
  } catch (e) {
    alert('삭제 실패');
  }
};

const goBack = () => navigateTo(`/recipes/${recipeId}`);
</script>

<style scoped>
.bg-primary-50 {
  background-color: #f0f9ff !important;
  border: 2px dashed #0ea5e9 !important;
}
</style>
