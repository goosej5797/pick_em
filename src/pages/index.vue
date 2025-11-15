<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

/**
 * Redirect to login or overview based on authentication
 */
onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (isAuthenticated) {
    router.push('/overview');
  } else {
    router.push('/login');
  }
});
</script>

