// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  // 여기에 커스텀 규칙을 추가합니다
  rules: {
    // 세미콜론을 항상 사용하고 싶을 때 (추천: 빨간 줄이 사라지고 세미콜론이 필수됨)
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
  },
});
