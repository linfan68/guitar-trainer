<template>
  <div id="app">
    <div class='controls'>
      <div class="main-control">
        <!-- <el-select v-model="startFrom" class="option-block" :style="{ width: '70px' }">
          <el-option
            v-for="item in startFromOptions"
            :key="item" :label="item" :value="item"/>
        </el-select> -->
        <ticker ref="ticker" 
          @finishedPlay="onNewLine"
          :script="currentNote"
          :nextScript="nextNote"
          :isPlaying.sync="isTickerPlaying"/>
      </div>
      <div class='options'>
        <rhythm-bank :lines.sync="lines" />
      </div>
      <!-- <midi-player></midi-player> -->
    </div>

    <div class='content'>
      <div
        :style="{background: 'lightgrey', lineHeight: '50px'}"
        class="stave-line-container"
        @click="onSelect(startFrom - 1)"
        >
        上一页
      </div>
      <div
        v-for="note in noteBlock" :key="note.key"
        :id="'stave-line-' + note.idx"
        class="stave-line-container"
        :class="{'stave-line-container-selected': note.idx === currentIdx}"
        @click="onSelect(note.idx)"
        >
        <el-button v-if="note.idx === currentIdx && !isTickerPlaying" class="note-btn" icon="el-icon-caret-right" @click="playStop"></el-button>
        <el-button v-if="note.idx === currentIdx && isTickerPlaying" class="note-btn" icon="el-icon-circle-close" @click="playStop"></el-button>
        <div v-if="note.idx !== currentIdx" class="note-idx" >{{note.idx + 1}}</div> 
        <stave-line :script="note.line" />
      </div>
      <div
        v-if="previewNote"
        :style="{background: 'lightgrey'}"
        class="stave-line-container"
        @click="onSelect(previewNote.idx)"
        >
        <div class="note-idx" >{{previewNote.idx + 1}}</div> 
        <stave-line :script="previewNote.line" />
      </div>
    </div>
    
  </div>
</template>

<script lang="ts" src="./App.ts">
</script>

<style lang="scss">

body {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: grid;
  grid-template-rows: auto 1fr;
  .controls {
    grid-row: 1/1;
    display: block;
    .options {
      display: flex;
    }
    .main-control {
      display: flex;
    }
  }

  .content {
    display: grid;
    overflow: auto;
    grid-row: 2/2;

    .stave-line-container {
      background-color: transparent;
      display: flex;
      justify-content: center;
      align-content: center;
    
      .note-idx {
        vertical-align: middle;
        line-height: 100%;
        font-size: 40px;
        width: 100px;
        height: 60px;
        align-self: center;
      }
      .note-btn {
        width: 100px;
        font-size: 30px;
        padding: 0px;
      }
    }
    .stave-line-container-selected {
      border-color: rgb(21, 220, 255);
      border-width: 4px;
      border-style: solid;
    }
  }
}

.option-block {
  width: 100px;
  margin: 5px;
}
.radio-block {
  margin: 5px;
}
</style>
