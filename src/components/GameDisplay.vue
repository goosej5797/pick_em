<template>
  <div class="game-display">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Pick'Em Manager</h1>
        <div class="progress">Game {{ currentGameIndex + 1 }} of {{ games.length }}</div>
      </div>

      <!-- Game Picker Section -->
      <div v-if="games.length > 0" class="game-picker-section">
        <GamePicker
          :game="currentGame"
          @spread-selected="handleSpreadSelected"
          @total-selected="handleTotalSelected"
        />

        <!-- Navigation Buttons -->
        <div class="navigation">
          <button
            :disabled="currentGameIndex === 0"
            @click="previousGame"
            class="btn btn-nav"
          >
            ← Previous
          </button>
          <button
            :disabled="currentGameIndex === games.length - 1"
            @click="nextGame"
            class="btn btn-nav"
          >
            Next →
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <p>No games available. Please add games to get started.</p>
      </div>

      <!-- Selections Summary Section -->
      <div class="selections-section">
        <h2>Your Selections</h2>
        <div v-if="selections.length > 0" class="selections-list">
          <div
            v-for="(selection, index) in selections"
            :key="selection.gameId"
            class="selection-card"
          >
            <div class="selection-header">
              <span class="game-number">Game {{ index + 1 }}</span>
              <span class="matchup">{{ selection.away_team }} @ {{ selection.home_team }}</span>
            </div>
            <div class="selection-details">
              <div class="selection-item">
                <span class="label">Spread:</span>
                <span class="value">{{ selection.spreadPick }}</span>
              </div>
              <div class="selection-item">
                <span class="label">Total:</span>
                <span class="value">{{ selection.totalPick }}</span>
              </div>
            </div>
            <button
              @click="removeSelection(selection.gameId)"
              class="btn btn-remove"
            >
              Remove
            </button>
          </div>
        </div>
        <div v-else class="no-selections">
          <p>No selections made yet. Start picking games!</p>
        </div>

        <!-- Submit Section -->
        <div v-if="selections.length > 0" class="submit-section">
          <button
            @click="submitSelections"
            :disabled="isSubmitting"
            class="btn btn-submit"
          >
            <span v-if="!isSubmitting">Submit Selections</span>
            <span v-else>Submitting...</span>
          </button>
          <div v-if="submitMessage" :class="['submit-message', submitStatus]">
            {{ submitMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Game } from '@/models';
import GamePicker from './GamePicker.vue';

interface Props {
  games: Game[];
}

const props = defineProps<Props>();

interface Selection {
  gameId: string | number;
  away_team: string;
  home_team: string;
  spreadPick: string;
  totalPick: string;
}

const currentGameIndex = ref(0);
const selections = ref<Selection[]>([]);

const currentGame = computed(() => {
  if (props.games && props.games.length > 0) {
    return props.games[currentGameIndex.value];
  }
  return null;
});

/**
 * Handle spread selection from GamePicker
 */
function handleSpreadSelected(team: string) {
  if (!currentGame.value) return;

  const existingSelection = selections.value.find(
    (s) => s.gameId === currentGame.value.id
  );

  if (existingSelection) {
    existingSelection.spreadPick = team;
  } else {
    selections.value.push({
      gameId: currentGame.value.id,
      away_team: currentGame.value.away_team,
      home_team: currentGame.value.home_team,
      spreadPick: team,
      totalPick: '',
    });
  }
}

/**
 * Handle total selection from GamePicker
 */
function handleTotalSelected(total: string) {
  if (!currentGame.value) return;

  const existingSelection = selections.value.find(
    (s) => s.gameId === currentGame.value.id
  );

  if (existingSelection) {
    existingSelection.totalPick = total;
  } else {
    selections.value.push({
      gameId: currentGame.value.id,
      away_team: currentGame.value.away_team,
      home_team: currentGame.value.home_team,
      spreadPick: '',
      totalPick: total,
    });
  }
}

/**
 * Navigate to previous game
 */
function previousGame() {
  if (currentGameIndex.value > 0) {
    currentGameIndex.value--;
  }
}

/**
 * Navigate to next game
 */
function nextGame() {
  if (currentGameIndex.value < props.games.length - 1) {
    currentGameIndex.value++;
  }
}

/**
 * Remove a selection by game ID
 */
function removeSelection(gameId: string | number) {
  selections.value = selections.value.filter((s) => s.gameId !== gameId);
}

// Submit state
const isSubmitting = ref(false);
const submitMessage = ref('');
const submitStatus = ref<'success' | 'error' | ''>('');

/**
 * Validate that all games have selections
 */
function validateSelections(): boolean {
  if (selections.value.length !== props.games.length) {
    submitStatus.value = 'error';
    submitMessage.value = `✗ Please make selections for all ${props.games.length} games.`;
    return false;
  }

  // Check if all selections have both spread and total picks
  const incomplete = selections.value.find(
    (s) => !s.spreadPick || !s.totalPick
  );

  if (incomplete) {
    submitStatus.value = 'error';
    submitMessage.value = '✗ All games must have both a spread and total selection.';
    return false;
  }

  return true;
}

/**
 * Submit selections to dummy server
 */
async function submitSelections() {
  if (selections.value.length === 0) return;

  // Validate before submitting
  if (!validateSelections()) {
    // Clear error message after 5 seconds
    setTimeout(() => {
      submitMessage.value = '';
      submitStatus.value = '';
    }, 5000);
    return;
  }

  isSubmitting.value = true;
  submitMessage.value = '';

  try {
    // Dummy server call - simulates API request
    const response = await fetch('/api/selections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selections: selections.value,
        timestamp: new Date().toISOString(),
      }),
    });

    // Simulate server response with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (response.ok || true) {
      submitStatus.value = 'success';
      submitMessage.value = '✓ Selections submitted successfully!';
      // Optional: clear selections after successful submission
      // selections.value = [];
    } else {
      submitStatus.value = 'error';
      submitMessage.value = '✗ Failed to submit selections. Please try again.';
    }
  } catch (error) {
    console.error('Error submitting selections:', error);
    submitStatus.value = 'success';
    submitMessage.value = '✓ Selections submitted successfully! (Demo mode)';
  } finally {
    isSubmitting.value = false;
    // Clear message after 5 seconds
    setTimeout(() => {
      submitMessage.value = '';
      submitStatus.value = '';
    }, 5000);
  }
}
</script>

<style scoped lang="scss">
.game-display {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: 40px;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      margin: 0 0 10px 0;
      font-size: 2.5rem;
      color: #333;
      font-weight: 700;
    }

    .progress {
      font-size: 1rem;
      color: #666;
      font-weight: 500;
    }
  }

  .game-picker-section {
    margin-bottom: 40px;
  }

  .navigation {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;

    .btn-nav {
      padding: 12px 28px;
      font-size: 1rem;
      font-weight: 600;
      background-color: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        background-color: #5568d3;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        opacity: 0.6;
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    background-color: #f5f5f5;
    border-radius: 8px;
    color: #666;
    font-size: 1.1rem;
  }

  .selections-section {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 24px;
    border: 2px solid #e0e0e0;

    h2 {
      margin-top: 0;
      margin-bottom: 24px;
      font-size: 1.5rem;
      color: #333;
    }

    .selections-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;

      .selection-card {
        background-color: white;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 16px;
        transition: all 0.3s ease;

        &:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }

        .selection-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;

          .game-number {
            font-weight: 700;
            color: #667eea;
            font-size: 0.9rem;
          }

          .matchup {
            font-weight: 600;
            color: #333;
            font-size: 0.95rem;
            text-align: right;
          }
        }

        .selection-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;

          .selection-item {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .label {
              font-weight: 500;
              color: #666;
              font-size: 0.9rem;
            }

            .value {
              font-weight: 700;
              color: #333;
              background-color: #f0f0f0;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 0.95rem;
            }
          }
        }

        .btn-remove {
          width: 100%;
          padding: 8px 12px;
          background-color: #ff6b6b;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background-color: #ff5252;
            transform: translateY(-1px);
          }
        }
      }
    }

    .no-selections {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 1rem;
    }

    .submit-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 2px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;

      .btn-submit {
        padding: 14px 40px;
        font-size: 1rem;
        font-weight: 700;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 200px;

        &:hover:not(:disabled) {
          background-color: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
        }

        &:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.7;
        }
      }

      .submit-message {
        padding: 12px 16px;
        border-radius: 6px;
        font-weight: 600;
        text-align: center;
        font-size: 0.95rem;
        animation: slideIn 0.3s ease-out;

        &.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        &.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      }
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
