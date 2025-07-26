<template>
  <v-app-bar color="primary" density="compact" class="shadow-md">
    <v-app-bar-title class="font-bold text-xl">
      <router-link to="/" class="text-white no-underline">CRM App</router-link>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <template v-if="!isLoggedIn">
      <v-btn to="/login" variant="text" class="hover:bg-blue-700 transition-colors">
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>
    </template>
    <template v-else>
      <v-btn to="/products" variant="text" class="hover:bg-blue-700 transition-colors mr-2">
        <span class="text-white">Products</span>
      </v-btn>
      <v-btn to="/cart" variant="text" class="hover:bg-blue-700 transition-colors mr-2">
        <v-icon>mdi-cart</v-icon>
      </v-btn>
      <v-btn to="/profile" variant="text" class="hover:bg-blue-700 transition-colors mr-2">
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn @click="logout" variant="text" class="hover:bg-blue-700 transition-colors">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AuthService from '@/services/auth.service';
import { authStore } from '@/stores/auth';

export default defineComponent({
  name: 'NavBar',
  computed: {
    isLoggedIn(): boolean {
      return authStore.state.isLoggedIn;
    },
    currentUser() {
      return authStore.state.user;
    }
  },
  methods: {
    logout() {
      AuthService.logout();
      this.$router.push('/login');
    }
  }
});
</script>

<style scoped>

.no-underline {
  text-decoration: none;
}
</style>