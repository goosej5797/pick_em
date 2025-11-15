<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Pick'Em</h1>
        <p class="subtitle">Make Your Picks</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Username Input -->
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="form-input"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="form-input"
            required
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="login-button"
        >
          <span v-if="!isLoading">Sign In</span>
          <span v-else>Signing In...</span>
        </button>
      </form>

      <!-- Demo Credentials -->
      <div class="demo-credentials">
        <p><strong>Demo Credentials:</strong></p>
        <p>Username: <code>demo</code></p>
        <p>Password: <code>password</code></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

/**
 * Handle login attempt
 */
async function handleLogin() {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Dummy authentication - accept demo/password
    if (username.value === 'demo' && password.value === 'password') {
      // Store user session (dummy)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username.value);

      // Navigate to overview page
      router.push('/overview');
    } else {
      errorMessage.value = 'Invalid username or password. Try demo/password';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'An error occurred during login. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

.login-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 36px;

  h1 {
    margin: 0 0 8px 0;
    font-size: 2rem;
    color: #667eea;
    font-weight: 700;
  }

  .subtitle {
    margin: 0;
    font-size: 0.95rem;
    color: #666;
    font-weight: 500;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
  }

  .form-input {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &::placeholder {
      color: #999;
    }
  }
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.login-button {
  padding: 12px 24px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
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
    opacity: 0.7;
  }
}

.demo-credentials {
  background-color: #f0f7ff;
  border: 1px solid #b3d9ff;
  border-radius: 6px;
  padding: 16px;
  font-size: 0.85rem;
  color: #1565c0;

  p {
    margin: 6px 0;

    &:first-child {
      margin-top: 0;
      font-weight: 700;
    }

    code {
      background-color: #e3f2fd;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #0d47a1;
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
