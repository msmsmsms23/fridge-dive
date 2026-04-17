<template>
  <UModal v-model="isOpen" prevent-close>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">요리 완료! 고생하셨어요 🎉</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="closeModal" />
        </div>
      </template>

      <div class="space-y-6 py-2">
        <div class="space-y-2">
          <label class="text-sm font-bold text-gray-700">완성된 요리 사진</label>
          <div
            class="relative border-2 border-dashed border-gray-200 rounded-2xl aspect-video flex flex-col items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            @click="triggerFileInput"
          >
            <template v-if="previewUrl">
              <img :src="previewUrl" alt="previewImage" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p class="text-white text-sm font-bold">사진 변경하기</p>
              </div>
            </template>
            <template v-else>
              <UIcon name="i-heroicons-camera" class="w-10 h-10 text-gray-400 mb-2" />
              <p class="text-xs text-gray-500">클릭해서 사진 업로드</p>
            </template>
          </div>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
        </div>

        <UFormGroup label="레시피 공개 설정" description="이 레시피를 다른 사람들에게 공유할까요?">
          <div class="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <UButton
              v-for="option in [{ label: '전체 공개', value: 'public', icon: 'i-heroicons-globe-alt' }, { label: '나만 보기', value: 'private', icon: 'i-heroicons-lock-closed' }]"
              :key="option.value"
              class="flex-1 rounded-lg font-bold transition-all"
              :color="isPublic === option.value ? 'white' : 'gray'"
              :variant="isPublic === option.value ? 'solid' : 'ghost'"
              :ui="{ color: { white: { solid: 'shadow-sm text-primary-600' }, transparent: { ghost: 'text-gray-500 hover:bg-gray-200/50' } } }"
              @click="isPublic = option.value"
            >
              <UIcon :name="option.icon" class="mr-1" />
              {{ option.label }}
            </UButton>
          </div>
        </UFormGroup>

        <UFormGroup label="요리 메모" description="오늘 요리하며 느낀 점이나 꿀팁을 적어보세요.">
          <UTextarea
            v-model="memo"
            placeholder="예: 오늘은 간이 딱 맞았어! 다음엔 청양고추를 하나 더 넣어볼까?"
            autoresize
            :rows="3"
          />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <UButton color="primary" block size="lg" class="flex-1" :loading="isSaving" @click="submitLog">
            기록 저장하고 마무리
          </UButton>
          <UButton color="gray" variant="soft" size="lg" @click="skipLog">
            건너뛰기
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  recipeId: [String, Number]
});

const emit = defineEmits(['update:modelValue', 'success']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const memo = ref('');
const previewUrl = ref(null);
const selectedFile = ref(null);
const fileInput = ref(null);
const isSaving = ref(false);
const isPublic = ref('public');

const { uploadImage } = usePhotoUpload(); // Cloudinary 업로드용 컴포저블

const triggerFileInput = () => fileInput.value.click();

const cropImageToSquare = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        // 이미지의 중앙 부분을 계산해서 자르기
        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.9);
      };
    };
  });
};

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const croppedFile = await cropImageToSquare(file);
    selectedFile.value = croppedFile;
    previewUrl.value = URL.createObjectURL(croppedFile);
  }
};

const closeModal = () => {
  isOpen.value = false;
  // 상태 초기화
  memo.value = '';
  previewUrl.value = null;
  selectedFile.value = null;
};

const submitLog = async () => {
  isSaving.value = true;
  try {
    let imageUrl = null;
    if (selectedFile.value) {
      imageUrl = await uploadImage(selectedFile.value);
    }

    const response = await $fetch(`/api/recipes/${props.recipeId}/complete`, {
      method: 'POST',
      body: {
        memo: memo.value,
        finishedImageUrl: imageUrl,
        isPublic: isPublic.value
      }
    });

    const logId = response.data?.id

    emit('success');
    navigateTo(`/logs/${logId}`);
    closeModal();
  } catch (error) {
    console.error(error);
    alert('기록 저장 중 오류가 발생했어요.');
  } finally {
    isSaving.value = false;
  }
};

const skipLog = async () => {
  await submitLog();
};
</script>
