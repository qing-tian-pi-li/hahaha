<template>
    <div id="app">
      <h1>控制台音乐播放器 (｀・ω・´)</h1>
      <ConsolePlayer />
      <PlaylistManager />
    </div>
  </template>
  
  <script>
  import ConsolePlayer from './components/ConsolePlayer.vue'
  import PlaylistManager from './components/PlaylistManager.vue'
  
  export default {
    name: 'App',
    components: {
      ConsolePlayer,
      PlaylistManager
    }
  }
  </script>
  
  <style>
  #app {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>