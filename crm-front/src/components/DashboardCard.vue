<template>
  <v-card class="hover:shadow-xl transition-shadow duration-300 mb-4">
    <v-card-title class="text-lg font-bold text-blue-700">{{ title }}</v-card-title>
    <v-card-text class="text-gray-700">
      <slot></slot>
    </v-card-text>
    <v-card-actions>
      <v-btn 
        color="primary" 
        variant="text" 
        class="hover:bg-blue-100 transition-colors"
      >
        {{ buttonText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DashboardCard',
  props: {
    title: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      default: 'View Details'
    }
  }
});
</script>