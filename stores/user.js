import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    ready: false,
    userData: [],
  }),

  actions: {
    async fetchCurrentUser() {
      try {
        const data = await $fetch('/api/auth/current');
        this.user = data.user || data;
      } catch (e) {
        this.user = null;
        console.log("로그인 상태 아님");
      }
    },

    async logout() {
      if (confirm('정말 로그아웃 하시겠습니까?')) {
        try {
          await fetch('/api/auth/logout');

          this.user = null;
          this.ready = true;

          alert('로그아웃 되었습니다.');
          window.location.href = '/';
          return true;
        } catch (err) {
          console.error(err);
        }
      }
      return false;
    },

    async updateUser(nickname) {
      if (confirm('수정하시겠습니까?') === true) {
        const editForm = {
          nickname
        };

        try {
          const response = await fetch('/api/profile/edit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(editForm),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const data = await response.json();
          alert('회원 정보가 수정되었습니다.');
          this.user = { ...this.user, ...data[0] };
          navigateTo('/')
          return data;
        } catch (err) {
          alert(err.message);
          throw err;
        }
      }
      return false;
    },

    async changePassword(password, password2) {
      const passwordForm = {
        password,
        password2,
      };

      try {
        const response = await fetch('/api/profile/password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(passwordForm),
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        alert('비밀번호가 변경되었습니다.');
        return await response.json();
      } catch (err) {
        throw err;
      }
    },

    async deleteUser(id) {
      if (confirm('정말 탈퇴하시겠습니까? 모든 정보가 삭제되며 복구하실 수 없습니다.') === true) {
        const deleteForm = {
          id
        };

        try {
          const response = await fetch('/api/profile', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(deleteForm),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const data = await response.json();
          alert('탈퇴되었습니다.');
          await this.fetchCurrentUser();
          navigateTo('/');
          return data;
        } catch (err) {
          alert(err.message);
          throw err;
        }
      }
      return false;
    },
  },
});
