<template>
  <div>
    <div class="ticker-body">
      <div class="controls">
        <el-button class="control-btn" v-if="!ticking" @click="onStart">Start</el-button>
        <el-button class="control-btn" v-else @click="onStop">Stop</el-button>
      </div>
      <div class="contents">
        <el-select class="measures-per-block" v-model="measuresPerBlock">
          <el-option
            v-for="item in measuresPerBlockOptoins"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <div class="beat-bar">
          <el-radio-group v-model="dingAt">
            <el-radio-button v-for="dot in beatDots" :key="dot.key" :label="dot.key" >
              <div
                class="beat-dot"
                :class="{'beat-dot-da': dot.v === 1, 'beat-dot-ding': dot.v === 2}" ></div>
            </el-radio-button>
          </el-radio-group>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Ticker.ts">

</script>

<style scoped>
.ticker-body {
  display: grid;
  grid-template-columns: auto 1fr;
}

.controls {
  grid-column: 1/1;
}
.contents {
  grid-column: 2/2;
  padding: 20px;
  display: flex;
  align-content: center;
  justify-content: flex-start;
}

.control-btn {
  width: 100px;
  height: 100px;
  margin: 20px;
}

.measures-per-block {
  width: 100px;
  margin: 10px;
}
.beat-bar {
  display: flex;
  justify-content: space-between;
}
.beat-dot-container {
  height: 50px;
  width: 50px;
  display: flex;
}
.beat-dot {
  justify-self: center;
  align-self: center;
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
}
.beat-dot-da {
  background-color: rgb(255, 234, 0);
}
.beat-dot-ding {
  background-color: rgb(39, 196, 8);
}
</style>


