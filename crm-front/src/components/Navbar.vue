<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/">CRM App</router-link>
    </div>
    <div class="navbar-menu">
      <div v-if="!isLoggedIn">
        <router-link to="/login" class="navbar-item">Connexion</router-link>
        <router-link to="/register" class="navbar-item">Inscription</router-link>
      </div>
      <div v-else>
        <span class="navbar-item">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
        <a href="#" @click.prevent="logout" class="navbar-item">Déconnexion</a>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AuthService from '@/services/auth.service';

export default defineComponent({
  name: 'NavBar',
  data() {
    return {
      currentUser: null as any
    };
  },
  computed: {
    isLoggedIn(): boolean {
      return AuthService.isLoggedIn();
    }
  },
  methods: {
    logout() {
      AuthService.logout();
      this.$router.push('/login');
    }
  },
  created() {
    this.currentUser = AuthService.getCurrentUser();
  }
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  gap: 15px;
}

.navbar-item {
  text-decoration: none;
  color: #333;
  padding: 5px 10px;
}

.navbar-item:hover {
  color: #007bff;
}
</style>