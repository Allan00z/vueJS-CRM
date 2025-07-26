<template>
  <div class="cart-container">
    <h1 class="cart-title">Mon Panier</h1>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      <p class="empty-message">Votre panier est vide</p>
      <v-btn color="primary" class="continue-shopping" to="/">Continuer vos achats</v-btn>
    </div>
    
    <div v-else>
      <v-list class="cart-items">
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <div class="item-info">
            <div class="item-image"></div>
            <div>
              <h3 class="item-name">{{ item.name }}</h3>
            </div>
          </div>
          
          <div class="item-actions">
            <div class="quantity-control">
              <v-btn v-if="item.quantity > 1" icon size="small" @click="decreaseQuantity(index)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="quantity">{{ item.quantity }}</span>
              <v-btn icon size="small" @click="increaseQuantity(index)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
            
            <div class="price">
              {{ formatPrice(item.price * item.quantity) }}
            </div>
            
            <v-btn icon color="error" @click="removeItem(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </v-list>
      
      <div class="cart-summary">
        <div class="summary-row">
          <span>Sous-total:</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="summary-row">
          <span>TVA (20%):</span>
          <span>{{ formatPrice(tax) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
        
        <v-btn color="primary" block class="checkout-btn" @click="checkout">
          Confirmer la commande
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default defineComponent({
  name: 'CartView',
  setup() {

    const cartItems = ref<CartItem[]>([]);
    // Fixture test
    // const cartItems = ref<CartItem[]>([
    //   {
    //     id: 1,
    //     name: "Verre",
    //     price: 12.20,
    //     quantity: 1
    //   },
    //   {
    //     id: 2,
    //     name: "Fourchette",
    //     price: 5.9,
    //     quantity: 2
    //   }
    // ]);
    
    // localStorage.setItem("cart", JSON.stringify(cartItems.value));

    // Load cart from localStorage
    const loadCartFromStorage = () => {
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        try {
          cartItems.value = JSON.parse(cartData);
        } catch (error) {
          console.error("Error parsing cart data from localStorage:", error);
        }
      }
    };
    
    // Initialize cart from localStorage
    loadCartFromStorage();

    const subtotal = computed(() => {
      return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    });

    const tax = computed(() => subtotal.value * 0.2);
    const total = computed(() => subtotal.value + tax.value);

    const formatPrice = (price: number): string => {
      return `${price.toFixed(2)} €`;
    };

    const increaseQuantity = (index: number) => {
      cartItems.value[index].quantity++;
      // Update localStorage after changing quantity
      localStorage.setItem("cart", JSON.stringify(cartItems.value));
    };

    const decreaseQuantity = (index: number) => {
      if (cartItems.value[index].quantity > 1) {
        cartItems.value[index].quantity--;
        // Update localStorage after changing quantity
        localStorage.setItem("cart", JSON.stringify(cartItems.value));
      }
    };

    const removeItem = (index: number) => {
      cartItems.value.splice(index, 1);
      // Update localStorage after removing item
      localStorage.setItem("cart", JSON.stringify(cartItems.value));
    };

    const checkout = () => {
      alert('Redirection vers la page de paiement...');
      // Ici vous pourriez implémenter la logique de paiement ou rediriger vers une page de paiement
    };

    return {
      cartItems,
      subtotal,
      tax,
      total,
      formatPrice,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      checkout
    };
  }
});
</script>

<style scoped>
.cart-container {
  padding: 16px;
}

.cart-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
}

.empty-cart {
  text-align: center;
  padding: 32px 0;
}

.empty-message {
  color: #6b7280;
}

.continue-shopping {
  margin-top: 16px;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
}

.item-info {
  display: flex;
  align-items: center;
}

.item-image {
  width: 64px;
  height: 64px;
  background-color: #e5e7eb;
  border-radius: 6px;
  margin-right: 16px;
}

.item-name {
  font-weight: 500;
}

.item-actions {
  display: flex;
  align-items: center;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-right: 32px;
}

.quantity {
  margin: 0 8px;
}

.price {
  margin-right: 32px;
  min-width: 80px;
  text-align: right;
}

.cart-summary {
  margin-top: 24px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.total {
  font-weight: bold;
  font-size: 1.125rem;
}

.checkout-btn {
  margin-top: 16px;
}
</style>