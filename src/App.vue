<template>
  <div id="app">
    <div class='sider'>
      <ticker ref="ticker" @nextBlock="onNewBlock"/>
    </div>

    <div class='content'>
      <div
        v-for="note in notes" :key="note.idx"
        :id="'stave-line-' + note.idx"
        class="stave-line-container"
        :class="{'stave-line-container-selected': note.idx === currentIdx}"
        @click="onSelect(note.idx)"
        >
        <div class="note-idx" >{{note.idx}}</div> 
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
  display: grid;
  grid-template-rows: auto 1fr;
}
.sider {
  grid-row: 1/1;
}

.content {
  display: grid;
  overflow: scroll;
  grid-row: 2/2;
}
.stave-line-container {
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-content: center;
}
.note-idx {
  vertical-align: middle;
  line-height: 100%;
  font-size: 40px;
  width: 40px;
  height: 40px;
  align-self: center;
}

.stave-line-container-selected {
  border-color: green;
  border-width: 1;
  border-style: solid;
}
</style>
