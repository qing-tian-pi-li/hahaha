<template>
  <div class="console-player">
    <div class="current-info">
      <h2>{{ currentSong ? currentSong.title : '未选择歌曲' }}</h2>
    </div>
    
    <div class="controls">
      <button @click="togglePlay">{{ isPlaying ? '暂停' : '播放' }}</button>
      <button @click="nextSong">下一首</button>
      <button @click="togglePlayMode">
        {{ playMode === 'order' ? '顺序播放' : '随机播放' }}
      </button>
    </div>
    
    <div class="progress-bar">
      <div :style="{ width: progress + '%' }" class="progress"></div>
    </div>
    
    <div class="time-info">
      {{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ConsolePlayer',
  
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      progress: 0,
      playbackTimer: null
    }
  },
  
  computed: {
    ...mapState(['currentSong', 'playMode']),
    totalDuration() {
      return this.currentSong ? this.currentSong.duration : 0
    }
  },
  
  methods: {
    togglePlay() {
      if (!this.currentSong) {
        this.$store.dispatch('playFirstSong')
      }
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) {
        this.startPlayback()
      } else {
        this.stopPlayback()
      }
    },
    
    startPlayback() {
      this.playbackTimer = setInterval(() => {
        if (this.currentTime < this.totalDuration) {
          this.currentTime++
          this.progress = (this.currentTime / this.totalDuration) * 100
        } else {
          this.nextSong()
        }
      }, 1000)
    },
    
    stopPlayback() {
      clearInterval(this.playbackTimer)
    },
    
    nextSong() {
      this.$store.dispatch('nextSong')
    },
    
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    
    togglePlayMode() {
      this.$store.commit('SET_PLAY_MODE', 
        this.playMode === 'order' ? 'random' : 'order')
    }
  },
  
  watch: {
    currentSong() {
      this.currentTime = 0
      this.progress = 0
      if (this.isPlaying) {
        this.stopPlayback()
        this.startPlayback()
      }
    }
  },
  
  beforeDestroy() {
    this.stopPlayback()
  }
}
</script>

<style scoped>
.console-player {
  flex: 1;
  padding: 20px;
  background: #2c3e50;
  color: #fff;
}

.current-info {
  text-align: center;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.controls button {
  padding: 8px 16px;
  background: #42b983;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #666;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: #42b983;
  transition: width 0.1s linear;
}

.time-info {
  text-align: center;
}
</style>