import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentSong: null,
    currentIndex: 0,
    playMode: 'order', // order/random
    playlists: [
      {
        id: 'default',
        name: '默认歌单',
        songs: [
          { id: '1', title: '歌曲1', duration: 180 },
          { id: '2', title: '歌曲2', duration: 200 },
          { id: '3', title: '歌曲3', duration: 160 },
          { id: '4', title: '歌曲4', duration: 240 },
          { id: '5', title: '歌曲5', duration: 190 }
        ]
      }
    ],
    searchQuery: '',
    selectedPlaylist: null
  },
  
  mutations: {
    SET_CURRENT_SONG(state, song) {
      state.currentSong = song
    },
    SET_PLAY_MODE(state, mode) {
      state.playMode = mode
    },
    ADD_PLAYLIST(state, playlist) {
      state.playlists.push(playlist)
    },
    ADD_SONG(state, { playlistId, song }) {
      const playlist = state.playlists.find(p => p.id === playlistId)
      if (playlist) {
        playlist.songs.push(song)
      }
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query
    },
    SET_SELECTED_PLAYLIST(state, playlist) {
      state.selectedPlaylist = playlist
    }
  },
  
  actions: {
    playFirstSong({ state, commit }) {
      if (state.playlists[0].songs.length > 0) {
        commit('SET_CURRENT_SONG', state.playlists[0].songs[0])
      }
    },
    playSong({ commit }, song) {
      commit('SET_CURRENT_SONG', song)
    },
    nextSong({ state, commit }) {
      const currentPlaylist = state.playlists.find(p => p.id === 'default')
      const strategy = {
        order: () => (state.currentIndex + 1) % currentPlaylist.songs.length,
        random: () => Math.floor(Math.random() * currentPlaylist.songs.length)
      }
      const nextIndex = strategy[state.playMode]()
      commit('SET_CURRENT_SONG', currentPlaylist.songs[nextIndex])
    }
  },

  getters: {
    filteredSongs: (state) => {
      if (!state.selectedPlaylist || !state.searchQuery) return []
      return state.selectedPlaylist.songs.filter(song => 
        song.title.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    }
  }
})