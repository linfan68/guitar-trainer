<template>
  <div>
    <div class="ticker-body">
      <el-button class="control-btn" v-if="!ticking" @click="onStart">Start</el-button>
      <el-button class="control-btn" v-else @click="onStop">Stop</el-button>
      <el-select class="option-block" v-model="measuresPerBlock">
        <el-option
          v-for="item in measuresPerBlockOptoins"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>

      <el-select class="option-block" v-model="bpm">
        <el-option
          v-for="item in bpmOptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      
      <el-radio-group v-model="dingAt" class="beat-bar">
        <el-radio-button v-for="dot in beatDots" :key="dot.key" :label="dot.key" >
          <div
            class="beat-dot"
            :class="{'beat-dot-da': dot.v === 1, 'beat-dot-ding': dot.v === 2}" ></div>
        </el-radio-button>
      </el-radio-group>
      
    </div>
  </div>
</template>

<script lang="ts" src="./Ticker.ts">

</script>

<style scoped>
.ticker-body {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  grid-template-columns: auto 1fr;
}

.control-btn {
  width: 100px;
  margin: 5px;
}

.option-block {
  width: 100px;
  margin: 5px;
}
.beat-bar {
  display: flex;
  justify-content: space-between;
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


