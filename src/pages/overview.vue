<template>
  <div class="overview-page">
    <!-- Header -->
    <div class="header-bar">
      <div class="header-content">
        <h1>Pick'Em Manager</h1>
        <div class="user-info">
          <span>Welcome, {{ username }}!</span>
          <button @click="handleLogout" class="logout-button">Logout</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <!-- User Stats Section -->
        <div class="stats-section">
          <h2>Your Record</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ userStats.wins }}</div>
              <div class="stat-label">Wins</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ userStats.losses }}</div>
              <div class="stat-label">Losses</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ userStats.winPercentage }}%</div>
              <div class="stat-label">Win Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ userStats.streak }}</div>
              <div class="stat-label">Current Streak</div>
            </div>
          </div>
        </div>

        <!-- Past Weeks Section -->
        <div class="weeks-section">
          <h2>Past Weeks</h2>
          <div v-if="pastWeeks.length > 0" class="weeks-grid">
            <div
              v-for="week in pastWeeks"
              :key="week.weekNumber"
              class="week-card past"
            >
              <div class="week-header">
                <span class="week-number">Week {{ week.weekNumber }}</span>
                <span :class="['week-result', week.result.toLowerCase()]">
                  {{ week.result }}
                </span>
              </div>
              <div class="week-info">
                <p><strong>{{ week.correct }}/{{ week.total }}</strong> Correct</p>
                <p class="week-date">{{ week.date }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-data">
            <p>No past weeks yet.</p>
          </div>
        </div>

        <!-- Current Week Section -->
        <div class="current-week-section">
          <h2>This Week's Picks</h2>
          <div class="current-week-card">
            <div class="week-info-large">
              <div class="week-details">
                <h3>Week {{ currentWeek.weekNumber }}</h3>
                <p class="week-description">{{ currentWeek.gamesCount }} games available</p>
                <p class="week-status" :class="currentWeek.status.toLowerCase()">
                  {{ currentWeek.status }}
                </p>
              </div>
            </div>
            <button
              @click="startPicking"
              class="start-picking-button"
            >
              Start Picking
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');

// User stats
interface UserStats {
  wins: number;
  losses: number;
  winPercentage: number;
  streak: string;
}

interface PastWeek {
  weekNumber: number;
  result: 'Won' | 'Lost';
  correct: number;
  total: number;
  date: string;
}

interface CurrentWeek {
  weekNumber: number;
  gamesCount: number;
  status: 'Open' | 'In Progress' | 'Closed';
}

const userStats = ref<UserStats>({
  wins: 12,
  losses: 8,
  winPercentage: 60,
  streak: '+3',
});

const pastWeeks = ref<PastWeek[]>([
  {
    weekNumber: 15,
    result: 'Won',
    correct: 9,
    total: 10,
    date: 'Nov 7 - Nov 13',
  },
  {
    weekNumber: 14,
    result: 'Lost',
    correct: 6,
    total: 10,
    date: 'Oct 31 - Nov 6',
  },
  {
    weekNumber: 13,
    result: 'Won',
    correct: 8,
    total: 10,
    date: 'Oct 24 - Oct 30',
  },
  {
    weekNumber: 12,
    result: 'Won',
    correct: 7,
    total: 10,
    date: 'Oct 17 - Oct 23',
  },
]);

const currentWeek = ref<CurrentWeek>({
  weekNumber: 16,
  gamesCount: 10,
  status: 'Open',
});

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

/**
 * Navigate to pickem page to start picking
 */
function startPicking() {
  router.push('/pickem');
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

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

// Stats Section
.stats-section {
  h2 {
    margin-top: 0;
    margin-bottom: 24px;
    font-size: 1.5rem;
    color: #333;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;

    .stat-card {
      background-color: white;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 0.95rem;
        color: #666;
        font-weight: 500;
      }
    }
  }
}

// Weeks Section
.weeks-section {
  h2 {
    margin-top: 0;
    margin-bottom: 24px;
    font-size: 1.5rem;
    color: #333;
  }

  .weeks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;

    .week-card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &.past {
        cursor: pointer;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
      }

      .week-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid #f0f0f0;

        .week-number {
          font-weight: 700;
          color: #333;
          font-size: 1rem;
        }

        .week-result {
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.85rem;

          &.won {
            background-color: #d4edda;
            color: #155724;
          }

          &.lost {
            background-color: #f8d7da;
            color: #721c24;
          }
        }
      }

      .week-info {
        p {
          margin: 8px 0;
          font-size: 0.95rem;
          color: #333;

          &:first-child {
            font-weight: 700;
            color: #667eea;
          }

          &.week-date {
            color: #999;
            font-size: 0.85rem;
            margin-top: 12px;
          }
        }
      }
    }
  }

  .no-data {
    text-align: center;
    padding: 40px;
    background-color: white;
    border-radius: 8px;
    color: #999;
  }
}

// Current Week Section
.current-week-section {
  h2 {
    margin-top: 0;
    margin-bottom: 24px;
    font-size: 1.5rem;
    color: #333;
  }

  .current-week-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 40px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    gap: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }

    .week-info-large {
      flex: 1;

      .week-details {
        h3 {
          margin: 0 0 12px 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .week-description {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .week-status {
          margin: 0;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 4px;
          display: inline-block;
          font-size: 0.9rem;

          &.open {
            background-color: rgba(40, 167, 69, 0.3);
            color: #b8e6c9;
          }

          &.in-progress {
            background-color: rgba(255, 193, 7, 0.3);
            color: #ffe082;
          }

          &.closed {
            background-color: rgba(244, 67, 54, 0.3);
            color: #ef9a9a;
          }
        }
      }
    }

    .start-picking-button {
      padding: 14px 40px;
      background-color: white;
      color: #667eea;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        background-color: #f5f5f5;
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 16px;
  }

  .container {
    gap: 24px;
  }

  .current-week-card {
    padding: 24px !important;
  }
}
</style>
