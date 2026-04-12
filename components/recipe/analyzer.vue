<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-primary-500" />
        <h3 class="text-xl font-bold">AI 레시피 등록</h3>
      </div>
    </template>

    <UTabs :items="tabs" class="w-full">
      <template #text-input>
        <div class="space-y-4 py-4">
          <UTextarea v-model="rawText" placeholder="레시피를 자유롭게 써 주세요..." :rows="8" />
          <UButton block size="lg" :loading="loading" :disabled="!rawText" @click="onAnalyzeText">텍스트 분석</UButton>
        </div>
      </template>

      <template #image-input>
        <div class="space-y-4 py-4 text-center">
          <div class="border-2 border-dashed rounded-lg p-10 cursor-pointer" @click="$refs.fileInput.click()">
            <img v-if="preview" :src="preview" class="max-h-64 mx-auto mb-2" />
            <p v-else>사진 업로드</p>
          </div>
          <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
          <UButton block size="lg" :loading="loading" :disabled="!file" @click="onAnalyzeImage">사진 분석</UButton>
        </div>
      </template>
    </UTabs>
  </UCard>
</template>

<script setup>
const emit = defineEmits(['success']);
const loading = ref(false);
const rawText = ref('');
const file = ref(null);
const preview = ref(null);

const tabs = [{ label: '텍스트', slot: 'text-input' }, { label: '사진', slot: 'image-input' }];

const onFileChange = (e) => {
  file.value = e.target.files[0];
  preview.value = URL.createObjectURL(file.value);
};

const onAnalyzeText = async () => {
  loading.value = true;
  try {
    const res = await $fetch('/api/recipes/ai-extract-text', { method: 'POST', body: { rawText: rawText.value } });
    emit('success', res.data);
  } finally { loading.value = false; }
};

const onAnalyzeImage = async () => {
  loading.value = true;
  const fd = new FormData(); fd.append('image', file.value);
  try {
    const res = await $fetch('/api/recipes/ai-extract-image', { method: 'POST', body: fd });
    emit('success', res.data);
  } finally { loading.value = false; }
};
</script>
