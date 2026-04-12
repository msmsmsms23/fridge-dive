<template>
  <UContainer class="py-8">
    <div v-if="pending" class="flex flex-col items-center justify-center py-20 gap-4">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary-500" />
      <p class="text-gray-500 animate-pulse">레시피를 불러오는 중입니다...</p>
    </div>

    <template v-else-if="recipe">
      <div v-if="!isCookingMode" class="max-w-3xl mx-auto space-y-8">
        <div class="flex justify-between items-end border-b pb-6">
          <div class="space-y-2">
            <h1 class="text-4xl font-black text-gray-900 leading-tight">{{ recipe.title }}</h1>
            <p class="text-lg text-gray-500">{{ recipe.description || '맛있는 요리 시간을 가져보세요.' }}</p>
          </div>
          <div class="flex gap-2">
            <UButton color="gray" variant="soft" icon="i-heroicons-pencil" @click="goEdit">수정</UButton>
            <UButton color="primary" size="lg" icon="i-heroicons-fire" @click="startCooking">요리 시작</UButton>
          </div>
        </div>

        <section>
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <UIcon name="i-heroicons-shopping-cart" class="text-primary-500" /> 필수 재료
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="ing in recipe.ingredients" :key="ing.id" class="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white transition-colors">
              <p class="font-bold text-gray-800">{{ ing.name }}</p>
              <p class="text-sm text-gray-500">{{ ing.amount }}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <UIcon name="i-heroicons-list-bullet" class="text-primary-500" /> 조리 과정
          </h3>
          <div class="space-y-4">
            <div v-for="step in recipe.steps" :key="step.id" class="flex gap-4 p-5 border rounded-2xl hover:bg-gray-50 transition-colors">
              <span class="text-primary-500 font-black text-xl italic">{{ step.stepOrder }}</span>
              <div class="space-y-1 flex-1">
                <p class="text-gray-700 leading-relaxed">{{ step.instruction }}</p>
                <div v-if="step.timerSeconds > 0" class="flex items-center gap-1 text-xs text-orange-500 font-medium">
                  <UIcon name="i-heroicons-clock" />
                  {{ Math.floor(step.timerSeconds / 60) }}분 {{ step.timerSeconds % 60 }}초 타이머
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="max-w-2xl mx-auto min-h-[70vh] flex flex-col justify-center">
        <div class="text-center mb-10">
          <UBadge size="lg" variant="subtle" class="px-4 py-1 rounded-full mb-4">
            {{ currentStepIndex === -1 ? `Step 0 / ${recipe.steps.length}` : `Step ${currentStepIndex + 1} / ${recipe.steps.length}` }}
          </UBadge>

          <div v-if="currentStepIndex === -1" class="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 class="text-4xl font-black text-gray-900 leading-tight">모든 재료가<br/>준비되었나요? 🧺</h2>
            <div class="grid grid-cols-2 gap-3 text-left max-w-sm mx-auto">
              <UCheckbox v-for="ing in recipe.ingredients" :key="ing.id" :label="`${ing.name} (${ing.amount})`" color="primary" />
            </div>
          </div>

          <div v-else class="space-y-10 animate-in fade-in zoom-in-95 duration-300">
            <h2 class="text-3xl font-bold text-gray-800 leading-snug break-keep">
              {{ currentStep.instruction }}
            </h2>

            <div v-if="currentStep.timerSeconds > 0" class="bg-primary-50 p-8 rounded-3xl border-2 border-primary-100 max-w-xs mx-auto space-y-4">
              <div class="text-6xl font-mono font-black text-primary-600 tracking-tighter">
                {{ formatTime(timeLeft) }}
              </div>
              <div class="flex justify-center gap-3">
                <UButton
                  :icon="isTimerRunning ? 'i-heroicons-pause-circle' : 'i-heroicons-play-circle'"
                  :color="isTimerRunning ? 'orange' : 'primary'"
                  size="xl"
                  class="rounded-full"
                  @click="toggleTimer"
                >
                  {{ isTimerRunning ? '일시정지' : '시작' }}
                </UButton>
                <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" class="rounded-full" @click="resetTimer" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-auto flex justify-between items-center border-t pt-10">
          <UButton
            variant="ghost"
            color="gray"
            icon="i-heroicons-chevron-left"
            size="xl"
            @click="prevStep"
            :disabled="currentStepIndex === -1"
          >
            이전
          </UButton>

          <div class="flex gap-2">
            <div v-for="i in (recipe.steps.length + 1)" :key="i"
                 class="w-2.5 h-2.5 rounded-full transition-all duration-300"
                 :class="i - 2 === currentStepIndex ? 'bg-primary-500 w-6' : 'bg-gray-200'" />
          </div>

          <UButton
            v-if="!isLastStep"
            color="primary"
            size="xl"
            trailing-icon="i-heroicons-chevron-right"
            class="px-8"
            @click="nextStep"
          >
            다음
          </UButton>
          <UButton
            v-else
            color="green"
            size="xl"
            icon="i-heroicons-check-badge"
            class="px-8 shadow-lg shadow-green-100"
            @click="finishCooking"
          >
            요리 완료!
          </UButton>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20 space-y-4">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-gray-300" />
      <p class="text-xl font-medium text-gray-500">레시피를 찾을 수 없어요.</p>
      <UButton to="/" variant="outline" icon="i-heroicons-home">홈으로 돌아가기</UButton>
    </div>
  </UContainer>

  <CookingLogModal
    v-model="showLogModal"
    :recipe-id="recipeId"
    @success="handleCookingComplete"
  />

  <UDivider class="my-10" />
  <CookingLogList :logs="recipe.cookingLogs || []" />
</template>

<script setup>
import CookingLogModal from "~/app/components/CookingLogModal.vue";
import CookingLogList from "~/app/components/CookingLogList.vue";

const route = useRoute();
const recipeId = route.params.id;

// 1. API 데이터 로드
const { data: recipeResponse, pending } = await useFetch(`/api/recipes/${recipeId}`);
const recipe = computed(() => recipeResponse.value?.data);

// 2. 요리 모드 관련 상태
const isCookingMode = ref(false);
const currentStepIndex = ref(-1); // -1: 준비물, 0~: 조리 단계
const isTimerRunning = ref(false);
const timeLeft = ref(0);
let timerInterval = null;

// 3. 현재 진행 단계 데이터 계산
const currentStep = computed(() => recipe.value?.steps?.[currentStepIndex.value] || null);
const isLastStep = computed(() => {
  if (!recipe.value?.steps) return true;
  return currentStepIndex.value === (recipe.value.steps.length - 1);
});

// 4. 시간 포맷팅 (00:00)
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// 5. 요리 모드 제어 함수들
const startCooking = () => {
  isCookingMode.value = true;
  currentStepIndex.value = -1; // 시작은 항상 재료 준비부터
};

const nextStep = () => {
  stopTimer();
  currentStepIndex.value++;
  // 다음 단계에 타이머가 있다면 초기화
  if (currentStep.value?.timerSeconds) {
    timeLeft.value = currentStep.value.timerSeconds;
  }
};

const prevStep = () => {
  stopTimer();
  currentStepIndex.value--;
  // 이전 단계의 타이머로 초기화
  if (currentStep.value?.timerSeconds) {
    timeLeft.value = currentStep.value.timerSeconds;
  }
};

const toggleTimer = () => {
  if (isTimerRunning.value) stopTimer();
  else startTimer();
};

const startTimer = () => {
  if (timeLeft.value <= 0) return;
  isTimerRunning.value = true;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      stopTimer();
      if (typeof window !== 'undefined') {
        window.alert('⏰ 타이머 종료! 다음 단계로 진행할까요?');
      }
    }
  }, 1000);
};

const stopTimer = () => {
  isTimerRunning.value = false;
  if (timerInterval) clearInterval(timerInterval);
};

const resetTimer = () => {
  stopTimer();
  timeLeft.value = currentStep.value?.timerSeconds || 0;
};

const showLogModal = ref(false);

const finishCooking = async () => {
  stopTimer();
  showLogModal.value = true;
};

const handleCookingComplete = () => {
  alert('오늘의 요리 일기가 저장되었습니다! 🍳');
  navigateTo('/');
};

onUnmounted(() => {
  stopTimer();
});

const goEdit = () => {
  navigateTo(`/recipes/${recipeId}/edit`);
};
</script>

<style scoped>
.animate-in {
  animation-duration: 0.4s;
}
</style>
