<template>
  <div class="playlist-manager">
    <div class="playlists-section">
      <button @click="showCreatePlaylistDialog">新建歌单</button>
      
      <div v-for="playlist in playlists" 
           :key="playlist.id" 
           class="playlist"
           :class="{ active: selectedPlaylist === playlist }">
        <div class="playlist-header">
          <h3 @click="selectPlaylist(playlist)">{{ playlist.name }}</h3>
          <button class="share-btn" @click.stop="sharePlaylist(playlist)">
            分享
          </button>
        </div>
        
        <div v-if="selectedPlaylist === playlist" class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索歌曲..."
            @input="updateSearch">
        </div>

        <div class="song-list">
          <div v-for="song in (searchQuery ? filteredSongs : playlist.songs)" 
               :key="song.id"
               class="song-item"
               @dblclick="playSong(song)">
            {{ song.title }} ({{ formatDuration(song.duration) }})
          </div>
        </div>
      </div>
    </div>

    <!-- 创建歌单对话框 -->
    <div v-if="showDialog" class="create-playlist-dialog">
      <input v-model="newPlaylistName" placeholder="请输入歌单名称">
      <button @click="createPlaylist">确定</button>
      <button @click="showDialog = false">取消</button>
    </div>

    <!-- 分享对话框 -->
    <div v-if="showShareDialog" class="share-dialog">
      <div class="share-content">
        <h3>分享歌单</h3>
        <p>歌单：{{ currentSharePlaylist.name }}</p>
        <div class="share-link">
          <input ref="shareInput" :value="shareLink" readonly>
          <button @click="copyShareLink">复制链接</button>
        </div>
        <button class="close-btn" @click="closeShareDialog">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PlaylistManager',
  
  data() {
    return {
      showDialog: false,
      showShareDialog: false,
      newPlaylistName: '',
      searchQuery: '',
      currentSharePlaylist: null,
      shareLink: ''
    }
  },
  
  computed: {
    ...mapState(['playlists', 'selectedPlaylist']),
    ...mapGetters(['filteredSongs'])
  },
  
  methods: {
    showCreatePlaylistDialog() {
      this.showDialog = true
    },
    
    createPlaylist() {
      if (this.newPlaylistName.trim()) {
        this.$store.commit('ADD_PLAYLIST', {
          id: Date.now().toString(),
          name: this.newPlaylistName,
          songs: []
        })
        this.showDialog = false
        this.newPlaylistName = ''
      }
    },
    
    selectPlaylist(playlist) {
      this.$store.commit('SET_SELECTED_PLAYLIST', playlist)
      this.searchQuery = ''
    },
    
    updateSearch(e) {
      this.$store.commit('SET_SEARCH_QUERY', e.target.value)
    },
    
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    
    playSong(song) {
      this.$store.dispatch('playSong', song)
    },

    sharePlaylist(playlist) {
      console.log('分享歌单:', playlist.name)
      this.currentSharePlaylist = playlist
      this.shareLink = `${window.location.origin}/playlist/${playlist.id}`
      this.showShareDialog = true
    },

    copyShareLink() {
      const input = this.$refs.shareInput
      input.select()
      document.execCommand('copy')
      alert('链接已复制到剪贴板！(●ˊωˋ●)')
    },

    closeShareDialog() {
      this.showShareDialog = false
      this.currentSharePlaylist = null
      this.shareLink = ''
    }
  }
}
</script>

<style scoped>
.playlist-manager {
  padding: 20px;
  position: relative;
}

.playlists-section {
  width: 300px;
  border-right: 1px solid #ddd;
  padding-right: 20px;
}

.playlist {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
}

.playlist.active {
  border-color: #42b983;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.share-btn {
  padding: 4px 8px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.share-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.share-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  color: #333;
}

.share-link {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.share-link input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.share-link button,
.close-btn {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-btn {
  width: 100%;
  margin-top: 10px;
  background: #666;
}

.search-box {
  margin: 10px 0;
}

.search-box input {
  width: 100%;
  padding: 5px;
}

.song-item {
  padding: 5px;
  cursor: pointer;
}

.song-item:hover {
  background-color: #f5f5f5;
}

.create-playlist-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}
</style>