export const usePhotoUpload = () => {
  const uploadImage = async (file: File) => {
    const cloudName = 'domizmkjj';
    const uploadPreset = 'ml_default';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        console.log('1. Cloudinary 업로드 성공:', data.secure_url);
        return data.secure_url; // 주소를 리턴!
      } else {
        console.error('업로드 응답에 URL이 없음:', data);
        return null;
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw new Error('이미지 업로드 중 문제가 생겼어요.');
    }
  };

  return { uploadImage };
};
