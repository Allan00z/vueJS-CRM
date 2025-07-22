<template>
  <div class="product-list">
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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import ProductService from '@/services/product.service';
// Import types
import { Product } from '@/assets/types/product'

export default defineComponent({
  name: 'ProductList',
  components: {
    ProductCard
  },
  setup() {
    const products = ref<Product[]>([]);
    const loading = ref(true);
    const error = ref('');

    const fetchProducts = async () => {
      try {
        // loading.value = true;
        // const response = await ProductService.getAll();
        // products.value = response.data;
        products.value = [
          {
            category: {id: 1, name:"", products: []},
            id: 1,
            name: 'Product 1',
            price: 100
          },
          {
            category: {id: 1, name:"", products: []},
            id: 2,
            name: 'Product 2',
            price: 20.51
          },
          {
            category: {id: 1, name:"", products: []},
            id: 3,
            name: 'Product 3',
            price: 31.98
          }
        ] as Product[]
      } catch (err) {
        console.error('Error fetching products:', err);
        error.value = 'Failed to load products. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      loading,
      error
    };
  }
});
</script>

<style scoped>
.product-list {
  padding: 20px;
}
</style>