<template>
  <v-card class="mx-auto my-2" max-width="350">
    <v-card-title>{{ product.name }}</v-card-title>
    <v-card-subtitle>{{ product.category?.name || 'No category' }}</v-card-subtitle>
    <v-card-text>
      <div class="text-h6">{{ formatPrice(product.price) }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="addToCart">Add to Cart</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
    
    <div v-if="showNotification" class="notification">
      {{ notificationMessage }}
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

interface Product {
  id: number;
  name: string;
  price: number;
  category?: {
    id: number;
    name: string;
  };
}

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  setup(props) {
    const showNotification = ref(false);
    const notificationMessage = ref('');

    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    };

    const addToCart = () => {
      const cartData = localStorage.getItem('cart');
      let cart = [];
      
      if (cartData) {
        try {
          cart = JSON.parse(cartData);
        } catch (error) {
          console.error('Error parsing cart data:', error);
        }
      }

      const existingItemIndex = cart.findIndex((item: any) => item.id === props.product.id);
      
      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          id: props.product.id,
          name: props.product.name,
          price: props.product.price,
          quantity: 1,
          category: props.product.category?.name || 'No category'
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      notificationMessage.value = `${props.product.name} added to cart`;
      showNotification.value = true;
      
      setTimeout(() => {
        showNotification.value = false;
      }, 3000);
    };

    return {
      formatPrice,
      addToCart,
      showNotification,
      notificationMessage
    };
  }
});
</script>

<style scoped>
.position-relative {
  position: relative;
}

.notification {
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(76, 175, 80, 1);
  color: white;
  padding: 8px;
  text-align: center;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  transition: all 0.3s ease;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>