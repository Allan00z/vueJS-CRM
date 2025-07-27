<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>My Profile</h1>
    </div>

    <div class="profile-section">
      <h2>Personal Information</h2>
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            v-model="userForm.firstName"
            required
          />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            v-model="userForm.lastName"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="userForm.email"
            required
          />
        </div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Updating...' : 'Update Profile' }}
        </button>
      </form>
    </div>

    <div class="profile-section">
      <h2>My Orders</h2>
      <div v-if="ordersLoading" class="loading">Loading orders...</div>
      <div v-else-if="orders.length === 0" class="no-orders">
        No orders found.
      </div>
      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-id">Order #{{ order.id }}</span>
            <span class="order-date">{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="order-total">
            Total: ${{ order.totalPrice }}
          </div>
          <div class="order-products">
            <div v-for="product in order.products" :key="product.id" class="product-item">
              {{ product.product.name }} - Qty: {{ product.quantity }} - ${{ product.totalPrice }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showNotification" class="notification" :class="notificationType">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AuthService from '@/services/auth.service'
import UserService from '@/services/user.service'
import { Order } from '@/assets/types/order'

const userForm = ref({
  firstName: '',
  lastName: '',
  email: ''
})

const orders = ref<Order[]>([])
const loading = ref(false)
const ordersLoading = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success')

const loadUserData = async () => {
  try {
    const user = AuthService.getCurrentUser()
    if (!user) return
    
    const response = await UserService.getOne(user.userId || user.id);
    const userData = response.data;
    userForm.value = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || ''
    }
    orders.value = userData.orders || []
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

const updateProfile = async () => {
  loading.value = true
  try {
    const user = AuthService.getCurrentUser()
    if (!user) return
    
    await UserService.update(user.userId || user.id, userForm.value)
    showTemporaryMessage('Profile updated successfully!', 'success')
  } catch (error) {
    console.error('Error updating profile:', error)
    showTemporaryMessage('Error updating profile', 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const showTemporaryMessage = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-form {
  max-width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-primary {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.order-id {
  font-weight: bold;
}

.order-date {
  color: #666;
}

.order-total {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.order-products {
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.product-item {
  padding: 5px 0;
  border-bottom: 1px solid #f5f5f5;
}

.loading, .no-orders {
  text-align: center;
  padding: 20px;
  color: #666;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.notification.success {
  background-color: #4caf50;
}

.notification.error {
  background-color: #f44336;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>