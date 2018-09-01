<template>
  <div id="app">
    <ticker @nextBlock="onNewBlock"/>
    <stave-line :notes="testNodes">
    </stave-line>
    <stave-line :notes="testNodes2">
    </stave-line>
  </div>
</template>

<script lang="ts" src="./App.ts">
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
