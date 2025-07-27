<template>
  <div class="text-center py-8">
    <v-card class="mx-auto max-w-2xl bg-white shadow-lg rounded-xl p-6">
      <h1 class="text-3xl font-bold text-blue-800 mb-6">Bienvenue sur votre CRM</h1>
      
      <div class="mb-6">
        <p class="text-gray-600 mb-6">Veuillez vous connecter pour accéder à toutes les fonctionnalités.</p>
        <div class="flex justify-center gap-4">
          <v-btn to="/login" color="primary" class="px-6 hover:bg-blue-700 transition-colors mr-4">
            Se connecter
          </v-btn>
          <v-btn to="/register" color="secondary" variant="outlined" class="px-6 hover:bg-gray-100 transition-colors">
            S'inscrire
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/auth.service';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(AuthService.isLoggedIn());

    onMounted(() => {
      if (isLoggedIn.value) {
        router.push('/products');
      }
    });

    return {
      isLoggedIn
    };
  }
});
</script>

<style scoped>
.product-list {
  padding: 20px;
}
</style>