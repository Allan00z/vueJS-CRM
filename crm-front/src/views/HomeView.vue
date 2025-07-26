<template>
  <!-- user logged in -->
  <div v-if="isLoggedIn" class="product-list">
    <h1 class="text-h4 mb-4">Products</h1>
    
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="product in products" :key="product.id">
        <ProductCard :product="product" />
      </v-col>
    </v-row>

    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
  
  <!-- user not logged in -->
  <div v-else class="text-center py-8">
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
import AuthService from '@/services/auth.service';
import ProductCard from '@/components/ProductCard.vue';
import ProductService from '@/services/product.service';
import { Product } from '@/assets/types/product';

export default defineComponent({
  name: 'HomeView',
  components: {
    ProductCard
  },
  setup() {
    // ProductList data
    const products = ref<Product[]>([]);
    const loading = ref(true);
    const error = ref('');

    const fetchProducts = async () => {
      try {
        loading.value = true;
        const response = await ProductService.getAll();
        products.value = response.data;
      } catch (err) {
        console.error('Error fetching products:', err);
        error.value = 'Failed to load products. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    const isLoggedIn = ref(AuthService.isLoggedIn());
    const currentUser = ref(AuthService.getCurrentUser());

    onMounted(() => {
      // if (isLoggedIn.value) {
      //   fetchProducts();
      // }
      fetchProducts();
    });

    return {
      products,
      loading,
      error,
      isLoggedIn,
      currentUser
    };
  }
});
</script>

<style scoped>
.product-list {
  padding: 20px;
}
</style>