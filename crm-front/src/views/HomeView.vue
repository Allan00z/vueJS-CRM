<template>
  <div class="home">
    <h1>Bienvenue sur votre CRM</h1>
    <div v-if="isLoggedIn">
      <p>Vous êtes connecté en tant que {{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
      <p>Gérez vos clients et vos projets facilement.</p>
    </div>
    <div v-else>
      <p>Veuillez vous connecter pour accéder à toutes les fonctionnalités.</p>
      <div class="auth-buttons">
        <router-link to="/login" class="btn btn-primary">Se connecter</router-link>
        <router-link to="/register" class="btn btn-secondary">S'inscrire</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AuthService from '@/services/auth.service';

export default defineComponent({
  name: 'HomeView',
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
  created() {
    this.currentUser = AuthService.getCurrentUser();
  }
});
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
}

.auth-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>