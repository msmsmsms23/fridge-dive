<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-primary-500" />
          <h3 class="text-xl font-bold">AI 레시피 등록</h3>

          <UPopover mode="hover">
            <UIcon
              name="i-heroicons-question-mark-circle"
              class="w-5 h-5 text-gray-400 cursor-help hover:text-gray-600 transition-colors"
            />

            <template #panel>
              <div class="p-4 text-sm max-w-[250px] leading-relaxed">
                텍스트나 이미지를 자유롭게 올리면 AI가 레시피의 이름, 설명, 재료, 요리 단계를 정리해 줘요.
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </template>

    <div v-if="loading" class="px-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div class="flex justify-between mb-2">
        <span class="text-xs font-medium text-primary-700">
          <UIcon name="i-heroicons-arrow-path" class="inline animate-spin mr-1" />
          {{ loadingText }}
        </span>
        <span class="text-xs font-bold text-primary-700">{{ Math.round(progress) }}%</span>
      </div>
      <UProgress :value="progress" size="sm" color="primary" />
    </div>

    <UTabs :items="tabs" class="w-full mt-2" :disabled="loading">
      <template #text-input>
        <div class="space-y-4 py-4">
          <UTextarea
            v-model="rawText"
            placeholder="레시피를 자유롭게 써 주세요... (예시: 물 두 스푼과 식용유 조금, 불닭소스, 모짜렐라 치즈를 넣고 전자레인지 2분 돌리기)"
            :rows="8"
            :disabled="loading"
          />
          <UButton block size="lg" :loading="loading" :disabled="!rawText" @click="onAnalyzeText">
            텍스트 분석 시작
          </UButton>
        </div>
      </template>

      <template #image-input>
        <div class="space-y-4 py-4 text-center">
          <div
            class="border-2 border-dashed rounded-lg p-10 transition-all"
            :class="[
              loading ? 'cursor-not-allowed opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary-400',
              preview ? 'border-primary-200' : 'border-gray-300'
            ]"
            @click="$refs.fileInput.click()"
          >
            <img v-if="preview" :src="preview" class="max-h-64 mx-auto mb-2 rounded-md shadow-sm" />
            <div v-else class="flex flex-col items-center gap-2">
              <UIcon name="i-heroicons-camera" class="w-10 h-10 text-gray-400" />
              <p class="text-gray-500">레시피가 담긴 사진을 올려주세요</p>
            </div>
          </div>
          <input ref="fileInput" type="file" class="hidden" :disabled="loading" @change="onFileChange" />
          <UButton block size="lg" :loading="loading" :disabled="!file" @click="onAnalyzeImage">
            사진 분석 시작
          </UButton>
        </div>
      </template>
    </UTabs>
  </UCard>
</template>

<script setup>
const emit = defineEmits(['success']);
const loading = ref(false);
const progress = ref(0);
const loadingText = ref('');
const rawText = ref('');
const file = ref(null);
const preview = ref(null);

const tabs = [{ label: '텍스트', slot: 'text-input' }, { label: '사진', slot: 'image-input' }];

const onFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    file.value = e.target.files[0];
    preview.value = URL.createObjectURL(file.value);
  }
};

// ✅ 공통 가짜 진행률 함수
let progressInterval;
const startProgress = (type) => {
  progress.value = 0;
  loadingText.value = type === 'text' ? '텍스트 내용을 읽고 있어요...' : '이미지에서 재료를 찾는 중이에요...';

  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10;

      // 진행률에 따라 메시지 변경 (디테일!)
      if (progress.value > 40 && progress.value < 70) {
        loadingText.value = 'AI가 조리 순서를 정리하고 있어요...';
      } else if (progress.value >= 70) {
        loadingText.value = '거의 다 됐어요! 예쁘게 다듬는 중...';
      }
    }
  }, 500);
};

const onAnalyzeText = async () => {
  loading.value = true;
  startProgress('text');

  try {
    const res = await $fetch('/api/recipes/ai-extract-text', { method: 'POST', body: { rawText: rawText.value } });
    progress.value = 100;
    setTimeout(() => emit('success', res.data), 400); // 100% 된 거 살짝 보여주고 완료
  } catch (err) {
    console.error(err);
    alert('분석에 실패했어요. 다시 시도해 주세요!');
  } finally {
    clearInterval(progressInterval);
    loading.value = false;
  }
};

const onAnalyzeImage = async () => {
  loading.value = true;
  startProgress('image');

  const fd = new FormData();
  fd.append('image', file.value);

  try {
    const res = await $fetch('/api/recipes/ai-extract-image', { method: 'POST', body: fd });
    progress.value = 100;
    setTimeout(() => emit('success', res.data), 400);
  } catch (err) {
    console.error(err);
    alert('사진을 분석할 수 없어요. 다른 사진을 써볼까요?');
  } finally {
    clearInterval(progressInterval);
    loading.value = false;
  }
};
</script>
