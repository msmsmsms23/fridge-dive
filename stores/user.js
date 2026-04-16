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

    async getUser() {
      try {
        const response = await fetch(`/api/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        this.userData = await response.json();
      } catch (err) {
        alert(err.message);
        throw err;
      }
    },

    async updateUser(username, email) {
      if (confirm('Are you want to update?') === true) {
        const editForm = {
          username,
          email,
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
          alert('Success!');
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

        alert('Success!');
        return await response.json();
      } catch (err) {
        alert(err.message);
        throw err;
      }
    },
  },
});
