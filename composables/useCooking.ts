export function useCooking(recipe: Ref<any>) {
  const isCookingMode = ref(false)
  const currentStepIndex = ref(-1)
  const isTimerRunning = ref(false)
  const timeLeft = ref(0)
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const currentStep = computed(() => recipe.value?.steps?.[currentStepIndex.value] ?? null)
  const isLastStep = computed(() => {
    if (!recipe.value?.steps) return true
    return currentStepIndex.value === recipe.value.steps.length - 1
  })

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const stopTimer = () => {
    isTimerRunning.value = false
    if (timerInterval) clearInterval(timerInterval)
  }

  const startTimer = () => {
    if (timeLeft.value <= 0) return
    isTimerRunning.value = true
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        stopTimer()
        window.alert('⏰ 타이머 종료! 다음 단계로 진행할까요?')
      }
    }, 1000)
  }

  const toggleTimer = () => isTimerRunning.value ? stopTimer() : startTimer()

  const resetTimer = () => {
    stopTimer()
    timeLeft.value = currentStep.value?.timerSeconds ?? 0
  }

  const startCooking = () => {
    isCookingMode.value = true
    currentStepIndex.value = -1
  }

  const nextStep = () => {
    stopTimer()
    currentStepIndex.value++
    if (currentStep.value?.timerSeconds) timeLeft.value = currentStep.value.timerSeconds
  }

  const prevStep = () => {
    stopTimer()
    currentStepIndex.value--
    if (currentStep.value?.timerSeconds) timeLeft.value = currentStep.value.timerSeconds
  }

  onUnmounted(stopTimer)

  return {
    isCookingMode, currentStepIndex, isTimerRunning, timeLeft,
    currentStep, isLastStep,
    formatTime, startCooking, nextStep, prevStep,
    toggleTimer, resetTimer, stopTimer,
  }
}
