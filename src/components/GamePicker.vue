<template>
  <div class="game-picker">
    <div class="game-header">
      <h3>{{game.away_team}} @ {{ game.home_team }}</h3>
    </div>

    <div class="game-content">
      <!-- Spread Picker -->
      <div class="form-group">
        <label>Spread Pick</label>
        <div class="button-group">
          <button
            :class="['btn', { active: spreadPick === game.home_team }]"
            @click="spreadPick = game.home_team"
          >
            {{ game.home_team }} ({{ formatSpread(game.spread) }})
          </button>
          <button
            :class="['btn', { active: spreadPick === game.away_team }]"
            @click="spreadPick = game.away_team"
          >
            {{ game.away_team }} ({{ formatSpread(-game.spread) }})
          </button>
        </div>
      </div>

      <!-- Total Picker (Over/Under) -->
      <div class="form-group">
        <label>Total Pick (O/U)</label>
        <div class="button-group">
          <button
            :class="['btn', { active: totalPick === 'over' }]"
            @click="totalPick = 'over'"
          >
            Over {{ game.total }}
          </button>
          <button
            :class="['btn', { active: totalPick === 'under' }]"
            @click="totalPick = 'under'"
          >
            Under {{ game.total }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Game } from '@/models';

interface Props {
  game: Game;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'spread-selected': [team: string];
  'total-selected': [total: string];
}>();

const spreadPick = ref<string>('');
const totalPick = ref<string>('');

/**
 * Reset picks when game changes
 */
watch(
  () => props.game.id,
  () => {
    spreadPick.value = '';
    totalPick.value = '';
  }
);

watch(
  () => spreadPick.value,
  (newValue) => {
    if (newValue) {
      emit('spread-selected', newValue);
    }
  }
);

watch(
  () => totalPick.value,
  (newValue) => {
    if (newValue) {
      emit('total-selected', newValue);
    }
  }
);

/**
 * Format spread value with sign
 */
function formatSpread(spread: number): string {
  if (spread > 0) {
    return `+${spread}`;
  }
  return `${spread}`;
}
</script>

<style scoped lang="scss">
.game-picker {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background-color: #f9f9f9;

  .game-header {
    margin-bottom: 20px;
    border-bottom: 2px solid #1976d2;
    padding-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #1976d2;
      font-weight: 600;
    }
  }

  .game-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-weight: 500;
      font-size: 0.95rem;
      color: #333;
    }

    .button-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      flex: 1;
      min-width: 140px;
      padding: 12px 16px;
      border: 2px solid #ccc;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 500;
      background-color: white;
      color: #333;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #1976d2;
        background-color: #f0f7ff;
      }

      &.active {
        background-color: #1976d2;
        border-color: #1976d2;
        color: white;
      }
    }
  }

  .summary {
    background-color: #e3f2fd;
    border-left: 4px solid #1976d2;
    padding: 12px;
    border-radius: 4px;
    margin-top: 8px;

    .summary-text {
      margin: 0;
      font-size: 0.95rem;
      color: #1565c0;
    }
  }
}
</style>
