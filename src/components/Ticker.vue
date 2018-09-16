<template>
  <div>
    <div class="ticker-loading" v-if="!isReadyPlay" v-loading="isLoading">
      <el-button type="danger" class="start-btn" @click="begin">开始</el-button>
    </div>
    <div class="ticker" v-if="isReadyPlay">
      <el-select class="option-block" v-model="barRepeat">
        <el-option
          v-for="item in barRepeatOptoins"
          :key="item"
          :label="item + 'bars'"
          :value="item">
        </el-option>
      </el-select>

      <el-select class="option-block" v-model="bpm">
        <el-option
          v-for="item in bpmOptions"
          :key="item" :label="item + 'bpm'" :value="item">
        </el-option>
      </el-select>
      
      <el-radio-group v-model="dingAt" class="beat-bar">
        <el-radio-button v-for="dot in beatDots" :key="dot.key" :label="dot.key" >
          <div
            class="beat-dot"
            :class="{'beat-dot-da': dot.v === 1, 'beat-dot-ding': dot.v === 2}" ></div>
        </el-radio-button>
      </el-radio-group>
      <el-checkbox class="option-block" v-model="playVoice" label="跟奏" border></el-checkbox>  
      <div ref='boo'>
      </div>
      <!-- <div>
        <el-checkbox v-model="alternateBars" label="AltBar" border></el-checkbox>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" src="./Ticker.ts">

</script>

<style lang="scss" scoped>
.ticker-loading {
  display: flex;
  width: 200px;
  justify-content: center;

  .start-btn {
    margin: 5px;
  }
}
.ticker {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  grid-template-columns: auto 1fr;
  align-items: center;
  .beat-bar {
    display: flex;
    justify-content: space-between;
    height: 41px;
    margin: 5px;
    .beat-dot {
      justify-self: center;
      align-self: center;
      height: 15px;
      width: 15px;
      background-color: #bbb;
      border-radius: 50%;
    }
    .beat-dot-da {
      background-color: rgb(255, 220, 21);
    }
    .beat-dot-ding {
      background-color: rgb(21, 220, 255);
    }
  }
}





</style>
