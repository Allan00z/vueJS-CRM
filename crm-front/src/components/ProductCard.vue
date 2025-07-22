<template>
  <v-card class="mx-auto my-2" max-width="344">
    <v-card-title>{{ product.name }}</v-card-title>
    <v-card-subtitle>{{ product.category?.name || 'No category' }}</v-card-subtitle>
    <v-card-text>
      <div class="text-h6">{{ formatPrice(product.price) }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="addToCart">Add to Cart</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';

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
    const router = useRouter();

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
        // +1 if product already in cart
        cart[existingItemIndex].quantity += 1;
      } else {
        // add if not in cart
        cart.push({
          id: props.product.id,
          name: props.product.name,
          price: props.product.price,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${props.product.name} added to cart`);
    };

    return {
      formatPrice,
      addToCart
    };
  }
});
</script>