<template>
  <div id="app">
    <div class='sider'>
      <el-select class="option-block" v-model="type" :style="{ width: '130px' }">
        <el-option
          v-for="item in typeOptions"
          :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select class="option-block" v-model="startFrom" :style="{ width: '70px' }">
        <el-option
          v-for="item in startFromOptions"
          :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <ticker ref="ticker" @nextBlock="onNewBlock"/>
    </div>

    <div class='content'>
      <div
        v-for="note in notes[0]" :key="note.noteStr"
        :id="'stave-line-' + note.idx"
        class="stave-line-container"
        :class="{'stave-line-container-selected': note.idx === currentIdx}"
        @click="onSelect(note.idx)"
        >
        <div class="note-idx" >{{note.idx}}</div> 
        <stave-line :notes="note.noteStr" />
      </div>
      <div
        :style="{background: 'lightgrey'}"
        v-for="note in notes[1]" :key="note.noteStr"
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
  display: flex;
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
  width: 100px;
  height: 40px;
  align-self: center;
}

.option-block {
  width: 100px;
  margin: 5px;
}

.stave-line-container-selected {
  border-color: rgb(21, 220, 255);
  border-width: 4px;
  border-style: solid;
}
</style>
