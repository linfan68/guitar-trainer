<template>
  <div id="app">
    <ticker class='header' ref="ticker" @nextBlock="onNewBlock"/>
    <div class='content'>
      <div
        v-for="note in notes" :key="note.idx"
        :id="'stave-line-' + note.idx"
        class="stave-line-container"
        :class="{'stave-line-container-selected': note.idx === currentIdx}"
        @click="onSelect(note.idx)"
        >
        <stave-line :notes="note.noteStr" />
      </div>
    </div>
    
  </div>
</template>

<script lang="ts" src="./App.ts">
</script>

<style>
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;

  display: grid;
  grid-template-rows: auto 1fr;
}
.header {
  grid-row: 1/1;
}

.content {
  display: grid;
  overflow: scroll;
  grid-row: 2/2;
}
.stave-line-container {
  background-color: transparent
}

.stave-line-container-selected {
  border-color: green;
  border-width: 1;
  border-style: solid;
}
</style>
