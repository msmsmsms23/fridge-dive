<template>
  <UContainer class="py-8">
    <RecipeStateView v-if="pending || !recipe" :pending="pending" />

    <template v-else>
      <RecipeDetail
        v-if="!isCookingMode"
        :recipe="recipe"
        @edit="navigateTo(`/recipes/${recipeId}/edit`)"
        @start="startCooking"
        @refresh="refresh"
      />

      <CookingMode
        v-else
        :recipe="recipe"
        :current-step-index="currentStepIndex"
        :current-step="currentStep"
        :is-last-step="isLastStep"
        :is-timer-running="isTimerRunning"
        :time-left="timeLeft"
        :format-time="formatTime"
        @back="isCookingMode = false"
        @prev="prevStep"
        @next="nextStep"
        @finish="finishCooking"
        @toggle-timer="toggleTimer"
        @reset-timer="resetTimer"
      />
    </template>
  </UContainer>

  <CookingLogModal v-model="showLogModal" :recipe-id="recipeId" @success="handleCookingComplete" />
  <UDivider class="my-10" />
  <CookingLogList v-if="!isCookingMode" :logs="recipe.cookingLogs || []" />
</template>

<script setup>
import CookingLogModal from '~/components/CookingLogModal.vue'
import CookingLogList from '~/components/CookingLogList.vue'
import RecipeStateView from "~/components/RecipeStateView.vue";
import RecipeDetail from "~/components/RecipeDetail.vue";
import CookingMode from "~/components/CookingMode.vue";

const route = useRoute()
const recipeId = route.params.id

const { data: recipeResponse, pending, refresh } = await useFetch(`/api/recipes/${recipeId}`)
const recipe = computed(() => recipeResponse.value?.data)

const {
  isCookingMode, currentStepIndex, currentStep, isLastStep,
  isTimerRunning, timeLeft, formatTime,
  startCooking, nextStep, prevStep, toggleTimer, resetTimer, stopTimer,
} = useCooking(recipe)

const showLogModal = ref(false)

const finishCooking = () => {
  stopTimer()
  showLogModal.value = true
}

const handleCookingComplete = () => {
  alert('오늘의 요리 일기가 저장되었습니다! 🍳')
  navigateTo('/')
}

</script>

<style scoped>
.animate-in { animation-duration: 0.4s; }
</style>
