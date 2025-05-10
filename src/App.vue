<script>
export default {
  name: 'App',
  data() {
    return {
      monthlySalary: '',
      workDays: '',
      workHours: '',
      isRunning: false,
      startTime: null,
      currentSalary: 0,
      elapsedSeconds: 0,
      timer: null,
      secondRate: 0,
      isPaused: false,
      pauseStartTime: null,
      totalPausedTime: 0,
      pausedSalary: 0,
      currentPauseDuration: 0,
      showPrivacy: true,
      currentLocale: 'en',
      user: null,
    };
  },
  computed: {
    formattedTime() {
      const totalSeconds = this.elapsedSeconds;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const milliseconds = Math.floor((totalSeconds % 1) * 1000);
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    },
    formattedPausedTime() {
      const totalSeconds = this.totalPausedTime + (this.isPaused ? this.currentPauseDuration : 0);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const milliseconds = Math.floor((totalSeconds % 1) * 1000);
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    },
    currentPausedSalary() {
      return this.pausedSalary + (this.isPaused ? this.secondRate * this.currentPauseDuration : 0);
    },
    getButtonText() {
      if (!this.isRunning) return this.$t('startWork');
      return this.isPaused ? this.$t('continueWork') : this.$t('slacking');
    },
    maskedSalary() {
      if (this.showPrivacy) {
        return this.currentSalary.toFixed(4);
      }
      return '****';
    },
    maskedPausedSalary() {
      if (this.showPrivacy) {
        return this.currentPausedSalary.toFixed(4);
      }
      return '****';
    },
  },
  methods: {
    createStars() {
      const starsContainer = this.$refs.starsContainer;
      const starCount = 200;

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        const size = Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.setProperty('--duration', `${1 + Math.random() * 2}s`);

        starsContainer.appendChild(star);
      }
    },
    toggleTimer() {
      if (!this.monthlySalary || !this.workDays || !this.workHours) {
        alert('请填写所有必要信息！');
        return;
      }

      if (!this.isRunning) {
        this.startTimer();
      } else {
        this.togglePause();
      }
    },
    startTimer() {
      this.isRunning = true;
      this.isPaused = false;
      this.startTime = new Date();
      this.elapsedSeconds = 0;
      this.currentSalary = 0;
      this.totalPausedTime = 0;
      this.pausedSalary = 0;
      this.currentPauseDuration = 0;

      // 计算每秒工资
      const hourlyRate = this.monthlySalary / this.workDays / this.workHours;
      this.secondRate = hourlyRate / 3600;

      this.timer = setInterval(() => {
        if (!this.isPaused) {
          const now = new Date();
          const elapsedTime = (now - this.startTime) / 1000;
          this.elapsedSeconds = elapsedTime - this.totalPausedTime;
          this.currentSalary = this.secondRate * this.elapsedSeconds;
        } else {
          // 更新当前暂停持续时间
          this.currentPauseDuration = (new Date() - this.pauseStartTime) / 1000;
        }
      }, 10);
    },
    stopTimer() {
      this.isRunning = false;
      this.isPaused = false;
      this.currentPauseDuration = 0;
      clearInterval(this.timer);
    },
    resetTimer() {
      this.stopTimer();
      this.elapsedSeconds = 0;
      this.currentSalary = 0;
      this.totalPausedTime = 0;
      this.pausedSalary = 0;
      this.currentPauseDuration = 0;
    },
    togglePause() {
      if (!this.isRunning) return;

      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.pauseStartTime = new Date();
        this.currentPauseDuration = 0;
      } else {
        const pauseDuration = (new Date() - this.pauseStartTime) / 1000;
        this.totalPausedTime += pauseDuration;
        this.pausedSalary += this.secondRate * pauseDuration;
        this.currentPauseDuration = 0;
      }
    },
    togglePrivacy() {
      this.showPrivacy = !this.showPrivacy;
    },
    toggleLocale() {
      this.currentLocale = this.currentLocale === 'en' ? 'zh' : 'en';
      this.$i18n.locale = this.currentLocale;
    },
    async handleGitHubLogin() {
      // Mock GitHub 登录
      try {
        // 模拟登录成功
        this.user = {
          email: 'user@example.com',
          name: 'GitHub User',
        };
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
  },
  mounted() {
    this.createStars();
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<template>
  <div class="app">
    <div class="stars" ref="starsContainer"></div>
    <div class="container">
      <div class="top-controls">
        <div class="user-info" v-if="user">
          {{ user.email }}
        </div>
        <div class="locale-toggle" @click="toggleLocale">
          {{ currentLocale === 'en' ? '中' : 'En' }}
        </div>
      </div>
      <div class="header">
        <img src="./assets/logo/fishing.png" alt="Logo" class="logo" />
        <h1>{{ $t('title') }}</h1>
      </div>
      <div class="form-group">
        <label for="monthlySalary" style="display: flex; align-items: center; gap: 10px"
          >{{ $t('monthlySalary') }}
          <div class="privacy-toggle" @click="togglePrivacy">
            <i class="eye-icon" :class="{ 'eye-open': showPrivacy, 'eye-closed': !showPrivacy }">
              <svg v-if="showPrivacy" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                />
              </svg>
            </i>
          </div>
        </label>
        <input id="monthlySalary" :value="showPrivacy ? monthlySalary : monthlySalary ? '****' : ''" @input="showPrivacy && (monthlySalary = $event.target.value)" :placeholder="$t('enterMonthlySalary')" :disabled="!showPrivacy" />
      </div>
      <div class="form-group">
        <label for="workDays">{{ $t('workDays') }}</label>
        <input type="number" id="workDays" v-model="workDays" :placeholder="$t('enterWorkDays')" />
      </div>
      <div class="form-group">
        <label for="workHours">{{ $t('workHours') }}</label>
        <input type="number" id="workHours" v-model="workHours" :placeholder="$t('enterWorkHours')" />
      </div>
      <div class="button-group">
        <button class="start-btn" @click="toggleTimer" :class="{ paused: isPaused }">
          {{ getButtonText }}
        </button>
        <button class="reset-btn" @click="resetTimer" :disabled="!isRunning && elapsedSeconds === 0">
          {{ $t('reset') }}
        </button>
      </div>
      <div class="result">{{ $t('todayWage') }}：¥{{ maskedSalary }}</div>
      <div class="timer">{{ $t('workingTime') }}：{{ formattedTime }}</div>
      <div class="paused-info">
        <div class="paused-time">{{ $t('slackingTime') }}：{{ formattedPausedTime }}</div>
        <div class="paused-salary">{{ $t('slackingEarnings') }}：¥{{ maskedPausedSalary }}</div>
      </div>
      <button class="github-login-btn" @click="handleGitHubLogin" v-if="!user">
        <svg class="github-icon" viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
        {{ $t('continueWithGitHub') }}
      </button>
    </div>
  </div>
</template>

<style>
.app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  width: 100vw;
  top: 0px;
  left: 0px;
  position: absolute;
  background: #000;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.star {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  animation: twinkle var(--duration) infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.container {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.5rem 2rem;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  z-index: 1;
  width: 60%;
  max-width: 500px;
  min-width: 300px;
  margin: auto;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  width: 180px;
  height: 90px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

h1 {
  text-align: center;
  margin: 0;
  color: #fff;
  font-size: 2rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #fff;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
}

input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.05);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
}

.start-btn,
.reset-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  white-space: nowrap;
}

.start-btn {
  background: linear-gradient(45deg, #000000, #1a1a1a);
  color: #ffffff;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 0 1px #ffffff2e;
}

.start-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.03), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

.start-btn.paused {
  background: linear-gradient(45deg, #1a1a1a, #000000);
  color: #ffffff;
}

.reset-btn {
  background: linear-gradient(45deg, #000000, #1a1a1a);
  color: #ffffff;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 0 1px #ffffff2e;
}

.reset-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.03), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

.start-btn:hover,
.reset-btn:hover {
  transform: scale(1.01);
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
  color: #ffffff;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.05);
}

.start-btn:disabled,
.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  filter: none;
  background: linear-gradient(45deg, #000000, #0a0a0a);
  color: #ffffff;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  20%,
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.result {
  margin-top: 1rem;
  text-align: center;
  font-size: 1rem;
  color: #fff;
}

.timer {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 1rem;
  color: #fff;
}

.paused-info {
  margin-top: 1rem;
  padding: 0.5rem;
  /* background: rgba(255, 255, 255, 0.05); */
  border-radius: 8px;
  text-align: center;
}

.paused-time {
  font-size: 1rem;
  color: #ffd93d;
  margin-bottom: 0.5rem;
}

.paused-salary {
  font-size: 1rem;
  color: #ff6b6b;
}

.top-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  /* padding: 20px; */
  top: 0px;
  right: 0px;
  position: absolute;
}

.user-info {
  color: var(--accent-a11);
  font-size: 14px;
}

.locale-toggle {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  /* background: rgba(255, 255, 255, 0.1); */
  /* backdrop-filter: blur(5px); */
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  /* transition: all 0.3s ease; */
}

.locale-toggle:hover {
  /* transform: scale(1.05); */
  /* background: rgba(255, 255, 255, 0.15); */
  color: rgba(255, 255, 255, 1);
}

.privacy-toggle {
  position: static;
  margin: 0;
}

.eye-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.eye-icon.eye-closed {
  color: rgba(255, 255, 255, 0.5);
}

.github-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  color: #ffffffee;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 20px;
  box-shadow: inset 0 0 0 1px #ffffff2e;
  transition: all 0.2s ease;
  margin: 0 auto;
}

.github-login-btn:hover {
  background: var(--accent-a3);
}

.github-icon {
  width: 20px;
  height: 20px;
}
</style>
