<template>
  <div class="login-container">
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required
          placeholder="Votre email"
        />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required
          placeholder="Votre mot de passe"
        />
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
      </button>
      <div class="register-link">
        Pas encore de compte ? <router-link to="/register">S'inscrire</router-link>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthService from '@/services/auth.service'

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async login() {
      this.error = ''
      this.loading = true
      
      try {
        await AuthService.login(this.email, this.password)
        this.$router.push('/')
      } catch (error: any) {
        if (error.response) {
          this.error = error.response.data.message || 'Erreur lors de la connexion'
        } else {
          this.error = 'Erreur de connexion au serveur'
        }
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:disabled {
  background-color: #cccccc;
}

.error-message {
  color: red;
  margin: 10px 0;
}

.register-link {
  margin-top: 15px;
  text-align: center;
}
</style>