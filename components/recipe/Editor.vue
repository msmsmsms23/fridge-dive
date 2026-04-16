<template>
  <UCard v-if="modelValue" :ui="{ body: { padding: 'px-4 py-6 sm:p-8' } }">
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-pencil-square" class="w-6 h-6 text-primary-500" />
          <h3 class="text-xl font-bold">레시피 최종 검토</h3>
        </div>
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" @click="$emit('reset')">
          다시 분석하기
        </UButton>
      </div>
    </template>

    <div class="space-y-8">
      <section class="space-y-4">
        <UFormGroup label="레시피 제목" required>
          <UInput
            :model-value="modelValue.title"
            size="lg"
            placeholder="예: 매콤달콤 떡볶이"
            @update:model-value="updateField('title', $event)"
          />
        </UFormGroup>
        <UFormGroup label="한줄 설명">
          <UTextarea
            :model-value="modelValue.description"
            placeholder="이 레시피만의 특별한 팁이 있나요?"
            autoresize
            @update:model-value="updateField('description', $event)"
          />
        </UFormGroup>

        <UFormGroup label="공개 범위 설정">
          <USelectMenu
            :model-value="getVisibilityOption(modelValue.isPublic)"
            :options="visibilityOptions"
            @update:model-value="updateVisibility"
          >
            <template #label>
              <div class="flex items-center gap-2">
                <UIcon :name="getVisibilityOption(modelValue.isPublic).icon" class="w-4 h-4" />
                <span>{{ getVisibilityOption(modelValue.isPublic).label }}</span>
              </div>
            </template>
          </USelectMenu>
          <p class="mt-1 text-xs text-gray-500">
            {{ getVisibilityOption(modelValue.isPublic).description }}
          </p>
        </UFormGroup>
      </section>

      <UDivider />

      <section>
        <div class="flex justify-between items-center mb-4">
          <label class="text-sm font-bold flex items-center gap-1">
            <UIcon name="i-heroicons-shopping-cart" /> 재료 리스트
          </label>
          <UButton size="xs" color="primary" variant="soft" icon="i-heroicons-plus" @click="addIngredient">
            재료 추가
          </UButton>
        </div>

        <div class="space-y-2">
          <div v-for="(ing, index) in modelValue.ingredients" :key="index"
               class="grid grid-cols-12 gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors items-center">
            <div class="col-span-6">
              <UInput v-model="ing.name" placeholder="재료명 (예: 감자)" />
            </div>
            <div class="col-span-4">
              <UInput v-model="ing.amount" placeholder="양 (예: 2개)" />
            </div>
            <div class="col-span-2 flex justify-end">
              <UButton color="red" variant="ghost" icon="i-heroicons-trash" size="sm" @click="removeIngredient(index)" />
            </div>
          </div>
        </div>
      </section>

      <UDivider />

      <section>
        <div class="flex justify-between items-center mb-4">
          <label class="text-sm font-bold flex items-center gap-1">
            <UIcon name="i-heroicons-list-bullet" /> 조리 순서
          </label>
          <UButton size="xs" color="primary" variant="soft" icon="i-heroicons-plus" @click="addStep">
            단계 추가
          </UButton>
        </div>

        <div class="space-y-6">
          <div v-for="(step, index) in modelValue.steps" :key="index" class="relative pl-8 pb-4 border-l-2 border-primary-100 last:border-0 last:pb-0">
            <div class="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold">
              {{ index + 1 }}
            </div>

            <div class="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
              <div class="flex gap-2 items-start">
                <UTextarea v-model="step.instruction" class="flex-1" placeholder="조리 방법을 설명해 주세요" autoresize :rows="2" />
                <UButton color="red" variant="ghost" icon="i-heroicons-x-mark" size="xs" @click="removeStep(index)" />
              </div>

              <div class="flex items-center gap-3 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-200 w-fit">
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-clock" class="w-4 h-4 text-primary-500" />
                  <span>타이머 설정:</span>
                </div>
                <div class="flex items-center gap-1">
                  <UInput v-model.number="step.timerSeconds" type="number" size="xs" class="w-20" />
                  <span class="text-xs">초</span>
                </div>
                <span v-if="step.timerSeconds >= 60" class="text-xs font-medium text-primary-600">
                  ({{ Math.floor(step.timerSeconds / 60) }}분 {{ step.timerSeconds % 60 }}초)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <UButton variant="ghost" color="primary" class="flex-1" size="xl" @click="$emit('reset')">
          취소
        </UButton>
        <UButton
          color="primary"
          class="flex-2 w-2/3"
          size="xl"
          :loading="loading"
          @click="$emit('save')"
        >
          나만의 레시피로 저장
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'reset', 'save']);

const visibilityOptions = [
  { label: '나만 보기', value: 'private', icon: 'i-heroicons-lock-closed', description: '나의 레시피함에만 보관합니다.' },
  { label: '친구 공개', value: 'friends', icon: 'i-heroicons-user-group', description: '나를 팔로우하는 친구들에게만 공개합니다.' },
  { label: '전체 공개', value: 'public', icon: 'i-heroicons-globe-americas', description: '커뮤니티 모든 사용자가 볼 수 있습니다.' }
];

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  });
};

const getVisibilityOption = (isPublic) => {
  if (isPublic === 'private') return visibilityOptions[0];
  if (isPublic === 'friends') return visibilityOptions[1];
  return visibilityOptions[2];
};

const updateVisibility = (option) => {
  updateField('isPublic', option.value);
};

const addIngredient = () => {
  const newIngredients = [...props.modelValue.ingredients, { name: '', amount: '', isEssential: true }];
  updateField('ingredients', newIngredients);
};

const removeIngredient = (index) => {
  const newIngredients = [...props.modelValue.ingredients];
  newIngredients.splice(index, 1);
  updateField('ingredients', newIngredients);
};

const addStep = () => {
  const maxOrder = props.modelValue.steps.reduce((max, s) => Math.max(max, s.stepOrder || 0), 0);
  const newSteps = [...props.modelValue.steps, { stepOrder: maxOrder + 1, instruction: '', timerSeconds: 0 }];
  updateField('steps', newSteps);
};

const removeStep = (index) => {
  const newSteps = [...props.modelValue.steps];
  newSteps.splice(index, 1);
  const reorderedSteps = newSteps.map((step, i) => ({ ...step, stepOrder: i + 1 }));
  updateField('steps', reorderedSteps);
};
</script>
