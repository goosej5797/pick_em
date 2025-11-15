<template>
  <div class="overview-page">
    <div class="header-bar">
      <div class="header-content">
        <h1>Pick'Em Manager</h1>
        <div class="user-info">
          <span>Welcome, {{ username }}!</span>
          <button @click="handleLogout" class="logout-button">Logout</button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <GameDisplay :games="games" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GameDisplay from '@/components/GameDisplay.vue';
import type { Game } from '@/models';

const router = useRouter();
const username = ref('');

// Sample games data
const games = ref<Game[]>([
  {
    id: 1,
    home_team: 'Team A',
    away_team: 'Team B',
    spread: -3.5,
    total: 45.5,
  },
  {
    id: 2,
    home_team: 'Team C',
    away_team: 'Team D',
    spread: 2.0,
    total: 42.0,
  },
  {
    id: 3,
    home_team: 'Team E',
    away_team: 'Team F',
    spread: -1.5,
    total: 48.0,
  },
]);

/**
 * Check authentication on component mount
 */
onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const storedUsername = localStorage.getItem('username');

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    router.push('/login');
  } else {
    username.value = storedUsername || 'User';
  }
});

/**
 * Handle logout
 */
function handleLogout() {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  router.push('/login');
}
</script>

<style scoped lang="scss">
.overview-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;

    span {
      font-weight: 500;
    }

    .logout-button {
      padding: 8px 16px;
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

.main-content {
  padding: 40px 20px;
}
</style>
